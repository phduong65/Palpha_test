<?php

namespace App\Http\Requests;

use App\Models\Booking;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'user_name' => ['required', 'string', 'max:255'],
            'start_time' => ['required', 'date_format:Y-m-d H:i:s', 'before:end_time'],
            'end_time' => ['required', 'date_format:Y-m-d H:i:s', 'after:start_time'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            if (! $this->filled(['room_id', 'start_time', 'end_time'])) {
                return;
            }

            $hasOverlap = Booking::query()
                ->where('room_id', $this->integer('room_id'))
                ->where('start_time', '<', $this->input('end_time'))
                ->where('end_time', '>', $this->input('start_time'))
                ->exists();

            if ($hasOverlap) {
                $validator->errors()->add(
                    'room_id',
                    'Phong nay da duoc dat trong thoi gian chon. Vui long chon thoi gian khac hoac phong khac.'
                );
            }
        });
    }
}
