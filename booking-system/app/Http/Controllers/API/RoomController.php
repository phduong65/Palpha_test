<?php

namespace App\Http\Controllers\API;

use App\Room;
use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use App\Http\Resources\BookingResource;

class RoomController extends Controller
{
    public function index()
    {
        return RoomResource::collection(
            Room::query()->orderBy('id')->get()
        );
    }

    public function bookings($id)
    {
        $room = Room::query()->findOrFail($id);

        return BookingResource::collection(
            $room->bookings()->orderBy('start_time')->get()
        );
    }
}
