<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\RoomResource;
use App\Models\Room;

class RoomController extends Controller
{
    public function index()
    {
        return RoomResource::collection(
            Room::query()->orderBy('id')->get()
        );
    }

    public function bookings(int $id)
    {
        $room = Room::query()->findOrFail($id);

        return BookingResource::collection(
            $room->bookings()->orderBy('start_time')->get()
        );
    }
}
