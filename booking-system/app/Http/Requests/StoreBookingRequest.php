<?php

namespace App\Http\Requests;

use App\Booking;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }
    public function rules()
    {
        return ['room_id' => 'required|integer|exists:rooms,id', 'user_name' => 'required|string|max:255', 'start_time' => 'required|date_format:Y-m-d H:i:s|before:end_time', 'end_time' => 'required|date_format:Y-m-d H:i:s|after:start_time',];
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (!$this->filled(['room_id', 'start_time', 'end_time'])) {
                return;
            }
            $hasOverlap = Booking::query()->where('room_id', $this->room_id)->where('start_time', '<', $this->end_time)->where('end_time', '>', $this->start_time)->exists();
            if ($hasOverlap) {
                $validator->errors()->add('room_id', 'This room is already booked in the selected time range.');
            }
        });
    }
}
