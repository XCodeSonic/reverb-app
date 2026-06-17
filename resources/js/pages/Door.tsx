import axios from 'axios';
import { useEchoPublic } from '@laravel/echo-react';
import { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// axios.defaults.withCredentials = true;
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

interface DoorStatusEvent {
    id: number;
    status: 'open' | 'closed';
}

const DOOR_COUNT = 10;
const DOORS = Array.from({ length: DOOR_COUNT }, (_, i) => ({
    id: i + 1,
    label: `Room ${101 + i}`,
}));

export default function Door() {
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

    const handleToggle = async (id: number, onClosedRattle: () => void) => {
        setLoading(prev => ({ ...prev, [id]: true }));
        try {
            const res = await axios.post<{ id: number; status: 'open' | 'closed' }>('/door/toggle', {
                id,
                status: statuses[id],
            });
            const next = res.data.status;
            setStatuses(prev => ({ ...prev, [id]: next }));

            if (next === 'closed') {
                onClosedRattle();
            }
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
                Smart Hotel Door Monitor
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-500 -mt-8"
            >
                Monitor all hotel doors from here
            </motion.p>

            <div className="flex flex-wrap justify-center gap-10 px-8 w-full max-w-screen-xl">
                {DOORS.map((door, i) => (
                    <DoorCard
                        key={door.id}
                        door={door}
                        status={statuses[door.id]}
                        loading={loading[door.id]}
                        onToggle={handleToggle}
                        delay={i * 0.08}
                    />
                ))}
            </div>

        </div>
    );
}

interface DoorCardProps {
    door: { id: number; label: string };
    status: 'open' | 'closed';
    loading: boolean;
    onToggle: (id: number, onClosedRattle: () => void) => void;
    delay: number;
    showButton?: boolean;
}

function DoorCard({ door, status, loading, onToggle, delay, showButton = true }: DoorCardProps) {
    // Each card owns its own animation controls.
    const controls = useAnimation();

    const rattle = () => {
        controls.start({
            x: [0, -6, 6, -4, 4, -2, 2, 0],
            transition: { duration: 0.5 },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 14, delay }}
            className="flex w-32 flex-col items-center gap-3"
        >
            {/* Room label */}
            <span className="text-sm font-semibold text-gray-600">{door.label}</span>

            {/* Door */}
            <div className="flex flex-col items-center gap-0" style={{ perspective: '600px' }}>
                <motion.div
                    animate={controls}
                    className="relative rounded-t-xl border-8 border-amber-900 bg-amber-200"
                    style={{ width: 100, height: 160 }}
                >
                    {/* Inside room */}
                    <div className="absolute inset-0 rounded-t-md bg-orange-100" />

                    {/* Door panel */}
                    <motion.div
                        animate={{ rotateY: status === 'open' ? -70 : 0 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 10, mass: 0.8 }}
                        style={{
                            width: '100%',
                            height: '100%',
                            transformOrigin: 'left center',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                        className="rounded-t-md bg-amber-700"
                    >
                        {/* Top panel */}
                        <div className="absolute left-2 right-2 rounded border-2 border-amber-800" style={{ top: '6%', height: '36%' }} />
                        {/* Bottom panel */}
                        <div className="absolute left-2 right-2 rounded border-2 border-amber-800" style={{ top: '47%', bottom: '6%' }} />
                        {/* Door knob */}
                        <div
                            className="absolute h-3 w-3 rounded-full shadow-md bg-yellow-400"
                            style={{ right: 10, top: '48%' }}
                        />
                    </motion.div>
                </motion.div>

                {/* Door step */}
                <div className="h-3 w-32 rounded-b-lg bg-amber-900" />
            </div>

            {/* Status badge */}
            <AnimatePresence mode="wait">
                <motion.span
                    key={status}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className={`w-20 rounded-full py-0.5 text-center text-xs font-semibold ${status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                    {status.toUpperCase()}
                </motion.span>
            </AnimatePresence>

            {/* Toggle button */}
            {showButton && (
                <motion.button
                    whileTap={{ scale: 0.93 }}
                    whileHover={{ scale: 1.06, y: -2 }}
                    onClick={() => onToggle(door.id, rattle)}
                    disabled={loading}
                    // className={`w-20 rounded-lg py-1.5 text-center text-sm font-semibold text-white shadow transition-colors disabled:opacity-50 ${status === 'open' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                    className={`w-20 cursor-pointer rounded-lg py-1.5 text-center text-sm font-semibold text-white shadow transition-colors disabled:opacity-50 ${status === 'open' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                >
                    {loading ? '...' : status === 'open' ? 'Close' : 'Open'}
                </motion.button>
            )}
        </motion.div>
    );
}
