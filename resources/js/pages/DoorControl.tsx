import axios from 'axios';
import { useEchoPublic } from '@laravel/echo-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

interface DoorStatusEvent {
    id: number;
    status: 'open' | 'closed';
}

const DOOR_COUNT = 10;
const DOORS = Array.from({ length: DOOR_COUNT }, (_, i) => ({
    id: i + 1,
    label: `Room ${101 + i}`,
}));

export default function DoorControl() {
    const [statuses, setStatuses] = useState<Record<number, 'open' | 'closed'>>(
        Object.fromEntries(DOORS.map(d => [d.id, 'closed']))
    );
    const [loading, setLoading] = useState<Record<number, boolean>>(
        Object.fromEntries(DOORS.map(d => [d.id, false]))
    );

    useEchoPublic(
        'door-status',
        '.door-status',
        (e: DoorStatusEvent) => {
            setStatuses(prev => ({ ...prev, [e.id]: e.status }));
        },
    );

    const handleToggle = async (id: number) => {
        setLoading(prev => ({ ...prev, [id]: true }));
        try {
            const res = await axios.post<{ id: number; status: 'open' | 'closed' }>('/door/toggle', {
                id,
                status: statuses[id],
            });
            setStatuses(prev => ({ ...prev, [id]: res.data.status }));
        } finally {
            setLoading(prev => ({ ...prev, [id]: false }));
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center gap-12 bg-white py-16">

            <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="text-3xl font-bold text-gray-800"
            >
                Door Control Panel
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-500 -mt-8"
            >
                Control all hotel doors from here
            </motion.p>

            <div className="flex flex-wrap justify-center gap-6 px-8 w-full max-w-screen-xl">
                {DOORS.map((door, i) => (
                    <ControlCard
                        key={door.id}
                        door={door}
                        status={statuses[door.id]}
                        loading={loading[door.id]}
                        onToggle={handleToggle}
                        delay={i * 0.08}
                    />
                ))}
            </div>

            {/* Open all / Close all */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex gap-4"
            >
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    onClick={() => DOORS.forEach(d => statuses[d.id] === 'closed' && handleToggle(d.id))}
                    // className="rounded-xl bg-green-600 px-6 py-2 font-semibold text-white shadow hover:bg-green-700 transition-colors"
                    className="cursor-pointer rounded-xl bg-green-600 px-6 py-2 font-semibold text-white shadow hover:bg-green-700 transition-colors"
                >
                    Open All
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    onClick={() => DOORS.forEach(d => statuses[d.id] === 'open' && handleToggle(d.id))}
                    // className="rounded-xl bg-red-500 px-6 py-2 font-semibold text-white shadow hover:bg-red-600 transition-colors"
                    className="cursor-pointer rounded-xl bg-red-500 px-6 py-2 font-semibold text-white shadow hover:bg-red-600 transition-colors"
                >
                    Close All
                </motion.button>
            </motion.div>
        </div>
    );
}

interface ControlCardProps {
    door: { id: number; label: string };
    status: 'open' | 'closed';
    loading: boolean;
    onToggle: (id: number) => void;
    delay: number;
}

function ControlCard({ door, status, loading, onToggle, delay }: ControlCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 14, delay }}
            className={`flex w-32 flex-col items-center gap-3 rounded-2xl border p-5 shadow-lg transition-colors ${
                status === 'open'
                    ? 'border-green-500 bg-white'
                    : 'border-amber-200 bg-white'
            }`}
        >
            {/* Status indicator dot */}
            <div className={`h-3 w-3 rounded-full ${status === 'open' ? 'bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.5)]' : 'bg-red-400'}`} />

            {/* Room label */}
            <span className="text-sm font-semibold text-gray-600">{door.label}</span>

            {/* Status badge */}
            <span className={`w-20 rounded-full py-0.5 text-center text-xs font-semibold ${status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {status.toUpperCase()}
            </span>

            {/* Toggle button */}
            <motion.button
                whileTap={{ scale: 0.93 }}
                whileHover={{ scale: 1.06, y: -2 }}
                onClick={() => onToggle(door.id)}
                disabled={loading}
                // className={`w-20 rounded-lg py-1.5 text-center text-sm font-semibold text-white shadow transition-colors disabled:opacity-50 ${
                //     status === 'open' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                // }`}
                className={`w-20 cursor-pointer rounded-lg py-1.5 text-center text-sm font-semibold text-white shadow transition-colors disabled:opacity-50 ${
                    status === 'open' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'
                }`}
            >
                {loading ? '...' : status === 'open' ? 'Close' : 'Open'}
            </motion.button>
        </motion.div>
    );
}
