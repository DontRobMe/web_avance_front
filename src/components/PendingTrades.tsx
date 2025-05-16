import React, { useState, useEffect } from 'react';
import { TradeProposal } from '../types/Trade';
import { PokedexEntry } from '../types/Pokedex';
import Gallery from './Gallery';

interface Props {
    currentUserId: string;
    onTradeAccepted: () => void;
}

const PendingTrades: React.FC<Props> = ({ currentUserId, onTradeAccepted }) => {
    const [proposals, setProposals] = useState<TradeProposal[]>([]);
    const [countering, setCountering] = useState<TradeProposal | null>(null);

    const [myInventory, setMyInventory] = useState<PokedexEntry[]>([]);
    const [otherInventory, setOtherInventory] = useState<PokedexEntry[]>([]);

    const [mySel, setMySel] = useState<PokedexEntry[]>([]);
    const [theirSel, setTheirSel] = useState<PokedexEntry[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('trade_proposals') || '[]';
        setProposals(JSON.parse(stored));
    }, []);

    const loadInventory = (userId: string): PokedexEntry[] => {
        const data = localStorage.getItem(`pokedex_${userId}`) || '[]';
        return (JSON.parse(data) as PokedexEntry[]).map(p => ({
            ...p,
            caughtAt: typeof p.caughtAt === 'string' ? Date.parse(p.caughtAt) : p.caughtAt,
        }));
    };

    const accept = (proposal: TradeProposal) => {
        const now = Date.now();

        const fromKey = `pokedex_${proposal.fromUserId}`;
        const toKey = `pokedex_${proposal.toUserId}`;

        const fromInventory: PokedexEntry[] = JSON.parse(localStorage.getItem(fromKey) || '[]');
        const toInventory: PokedexEntry[] = JSON.parse(localStorage.getItem(toKey) || '[]');
        
        const isSamePokemon = (a: PokedexEntry, b: PokedexEntry) =>
            a.pokedex_id === b.pokedex_id &&
            new Date(a.caughtAt).getTime() === new Date(b.caughtAt).getTime();

        const newFromInventory = fromInventory.filter(p =>
            !proposal.mySelection.some(sel => isSamePokemon(sel, p))
        ).concat(proposal.theirSelection);

        const newToInventory = toInventory.filter(p =>
            !proposal.theirSelection.some(sel => isSamePokemon(sel, p))
        ).concat(proposal.mySelection);

        localStorage.setItem(fromKey, JSON.stringify(newFromInventory));
        localStorage.setItem(toKey, JSON.stringify(newToInventory));

        const fromHistoryKey = `trade_history_${proposal.fromUserId}`;
        const toHistoryKey = `trade_history_${proposal.toUserId}`;
        const fromHistory = JSON.parse(localStorage.getItem(fromHistoryKey) || '[]');
        const toHistory = JSON.parse(localStorage.getItem(toHistoryKey) || '[]');

        const entry = {
            timestamp: now,
            fromUserId: proposal.fromUserId,
            toUserId: proposal.toUserId,
            sent: proposal.mySelection,
            received: proposal.theirSelection,
        };
        const reciprocalEntry = {
            ...entry,
            fromUserId: proposal.toUserId,
            toUserId: proposal.fromUserId,
            sent: proposal.theirSelection,
            received: proposal.mySelection,
        };

        localStorage.setItem(fromHistoryKey, JSON.stringify([...fromHistory, entry]));
        localStorage.setItem(toHistoryKey, JSON.stringify([...toHistory, reciprocalEntry]));

        const updatedProposals = proposals.map(p =>
            p.id === proposal.id ? { ...p, status: 'accepted' as const } : p
        );
        localStorage.setItem('trade_proposals', JSON.stringify(updatedProposals));
        setProposals(updatedProposals);

        onTradeAccepted();
    };

    const received = proposals.filter(
        p => p.toUserId === currentUserId && p.status === 'pending'
    );

    const toggle = (
        pokemon: PokedexEntry,
        list: PokedexEntry[],
        setList: React.Dispatch<React.SetStateAction<PokedexEntry[]>>
    ) => {
        const exists = list.some(p => p.pokedex_id === pokemon.pokedex_id && p.caughtAt === pokemon.caughtAt);
        setList(exists ? list.filter(p => !(p.pokedex_id === pokemon.pokedex_id && p.caughtAt === pokemon.caughtAt)) : [...list, pokemon]);
    };

    const startCounter = (proposal: TradeProposal) => {
        setCountering(proposal);
        setMySel(proposal.theirSelection);
        setTheirSel(proposal.mySelection);
        setMyInventory(loadInventory(currentUserId));
        setOtherInventory(loadInventory(proposal.fromUserId));
    };

    const submitCounter = () => {
        if (!countering) return;

        const updated: TradeProposal = {
            ...countering,
            fromUserId: currentUserId,
            toUserId: countering.fromUserId,
            mySelection: mySel,
            theirSelection: theirSel,
            status: 'pending',
            timestamp: Date.now(),
        };

        const updatedProposals = proposals.map(p => (p.id === updated.id ? updated : p));
        localStorage.setItem('trade_proposals', JSON.stringify(updatedProposals));
        setProposals(updatedProposals);

        setCountering(null);
        setMySel([]);
        setTheirSel([]);
        alert('Contre-proposition envoyée !');
    };

    if (received.length === 0 && !countering) {
        return <p>Aucune demande reçue.</p>;
    }

    return (
        <div className="pending-trades">
            <h3>Demandes d’échange reçues</h3>

            {!countering && received.map((proposal, i) => (
                <div key={i} className="proposal">
                    <p>
                        Proposé par <strong>{proposal.fromUserId}</strong> – {new Date(proposal.timestamp).toLocaleString()}
                    </p>
                    <div>
                        <small>Ils veulent :</small>{' '}
                        {proposal.theirSelection.map((pk, j) => (
                            <img key={j} src={pk.sprites.regular} alt={pk.name} width={30} />
                        ))}
                    </div>
                    <div>
                        <small>Ils offrent :</small>{' '}
                        {proposal.mySelection.map((pk, j) => (
                            <img key={j} src={pk.sprites.regular} alt={pk.name} width={30} />
                        ))}
                    </div>
                    <button onClick={() => accept(proposal)}>Accepter</button>
                    <button onClick={() => startCounter(proposal)}>Faire une contre-proposition</button>
                </div>
            ))}

            {countering && (
                <div className="counter-form">
                    <h4>Contre-proposition à {countering.fromUserId}</h4>
                    <div className="trade-selection">
                        <div>
                            <h5>Vous donnez</h5>
                            <Gallery pokemons={myInventory} selected={mySel} onToggleSelect={pk => toggle(pk, mySel, setMySel)} />
                        </div>
                        <div>
                            <h5>Vous recevez</h5>
                            <Gallery pokemons={otherInventory} selected={theirSel} onToggleSelect={pk => toggle(pk, theirSel, setTheirSel)} />
                        </div>
                    </div>
                    <button onClick={submitCounter} disabled={mySel.length === 0 || theirSel.length === 0}>
                        Envoyer la contre-proposition
                    </button>
                    <button onClick={() => setCountering(null)}>Annuler</button>
                </div>
            )}
        </div>
    );
};

export default PendingTrades;
