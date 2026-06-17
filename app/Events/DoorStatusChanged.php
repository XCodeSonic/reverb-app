<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DoorStatusChanged implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public int $id, public string $status) {}

    public function broadcastOn(): Channel
    {
        return new Channel('door-status');
    }

    public function broadcastAs(): string
    {
        return 'door-status';
    }

    public function broadcastWith(): array
    {
        return ['id' => $this->id, 'status' => $this->status];
    }
}
