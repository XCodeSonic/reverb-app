<?php

namespace App\Http\Controllers;

use App\Events\DoorStatusChanged;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoorController extends Controller
{
    public function toggle(Request $request): JsonResponse
    {
        $id = $request->input('id');
$current = $request->input('status', 'closed');
$newStatus = $current === 'open' ? 'closed' : 'open';

broadcast(new DoorStatusChanged($id, $newStatus));

return response()->json(['id' => $id, 'status' => $newStatus]);
    }
}
