<?php

namespace App\Http\Controllers\API;

use App\Booking;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use Symfony\Component\HttpFoundation\Response;

class BookingController extends Controller
{
    public function store(StoreBookingRequest $request)
    {
        $booking = Booking::query()->create($request->validated());

        return (new BookingResource($booking))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function destroy($id)
    {
        $booking = Booking::query()->findOrFail($id);
        $booking->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
