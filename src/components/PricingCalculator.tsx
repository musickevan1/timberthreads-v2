/** @jsxImportSource preact */
import { useState } from 'preact/hooks';

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`;
}

function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  constraintMessage,
  id,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  constraintMessage: string;
  id: string;
  onChange: (value: number) => void;
}) {
  const percent = ((value - min) / (max - min)) * 100;
  const trackStyle = {
    background: `linear-gradient(to right, var(--color-brand) ${percent}%, #d6d3d1 ${percent}%)`,
  };

  return (
    <div class="mb-6">
      <div class="flex justify-between items-baseline mb-2">
        <label for={id} class="text-base font-medium text-stone-700">
          {label}
        </label>
        <span class="text-2xl font-bold text-stone-800">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onInput={(e) => onChange(parseInt((e.target as HTMLInputElement).value, 10))}
        style={trackStyle}
        class="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
      />
      <p class="text-base text-stone-400 mt-1">{constraintMessage}</p>
    </div>
  );
}

export default function PricingCalculator() {
  const [groupSize, setGroupSize] = useState(6);
  const [nights, setNights] = useState(3);
  const [includeMeals, setIncludeMeals] = useState(false);

  // Pricing logic
  const isFlatRate = groupSize > 10;
  let accommodationCost: number;
  let foodCost: number;
  let total: number;

  const mealRate = isFlatRate ? 12.5 : 15;

  if (!isFlatRate) {
    accommodationCost = 60 * groupSize * nights;
    foodCost = includeMeals ? mealRate * groupSize * nights : 0;
    total = accommodationCost + foodCost;
  } else {
    accommodationCost = 600 * nights;
    foodCost = includeMeals ? mealRate * groupSize * nights : 0;
    total = accommodationCost + foodCost;
  }

  const perPerson = Math.round(total / groupSize);

  function handleGetQuote() {
    window.dispatchEvent(
      new CustomEvent('calculator:quote-requested', {
        detail: {
          groupSize,
          nights,
          includeMeals,
          total,
          perPerson,
          isFlatRate,
        },
      })
    );
  }

  return (
    <div class="grid md:grid-cols-2 gap-8">
      {/* Inputs panel */}
      <div class="bg-stone-50 rounded-xl p-6 md:p-8">
        <h3 class="font-serif text-xl text-stone-800 mb-6">Your Stay</h3>

        <SliderInput
          id="group-size"
          label="Group Size"
          value={groupSize}
          min={4}
          max={12}
          constraintMessage="Minimum 4 persons"
          onChange={setGroupSize}
        />

        <SliderInput
          id="nights"
          label="Number of Nights"
          value={nights}
          min={2}
          max={7}
          constraintMessage="Minimum 2-night stay"
          onChange={setNights}
        />

        {/* Meals toggle */}
        <div class="flex items-center justify-between mt-4">
          <div>
            <p class="text-base font-medium text-stone-700">Include Meals</p>
            <p class="text-base text-stone-500">+${isFlatRate ? '12.50' : '15'}/night per person{isFlatRate ? ' (2 meals & snacks)' : ''}</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={includeMeals}
            aria-label="Include meals"
            onClick={() => setIncludeMeals(!includeMeals)}
            class={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
              includeMeals ? 'bg-brand' : 'bg-stone-300'
            }`}
          >
            <span class="sr-only">Include meals</span>
            <span
              aria-hidden="true"
              class={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                includeMeals ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Breakdown panel */}
      <div aria-live="polite" class="bg-white rounded-xl shadow-md p-6 md:p-8 flex flex-col">
        <h3 class="font-serif text-xl text-stone-800 mb-6">Estimate Breakdown</h3>

        <div class="flex-1 space-y-3">
          {/* Flat rate note */}
          {isFlatRate && (
            <div class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4">
              <p class="text-base text-amber-800 font-medium">Groups of 10-12: flat rate of $600/night</p>
            </div>
          )}

          {/* Accommodation line item */}
          <div class="flex justify-between items-start text-stone-700">
            <span class="text-base leading-snug pr-4">
              {isFlatRate
                ? `Accommodation: $600/night \u00d7 ${nights} night${nights !== 1 ? 's' : ''}`
                : `Accommodation: ${groupSize} guests \u00d7 $60/night \u00d7 ${nights} night${nights !== 1 ? 's' : ''}`}
            </span>
            <span class="text-base font-semibold whitespace-nowrap">{formatCurrency(accommodationCost)}</span>
          </div>

          {/* Meals line item */}
          {includeMeals && (
            <div class="flex justify-between items-start text-stone-700">
              <span class="text-base leading-snug pr-4">
                Meals: {groupSize} guests &times; ${isFlatRate ? '12.50' : '15'}/night &times; {nights} night{nights !== 1 ? 's' : ''}
              </span>
              <span class="text-base font-semibold whitespace-nowrap">{formatCurrency(foodCost)}</span>
            </div>
          )}

          {/* Divider */}
          <div class="border-t border-stone-200 pt-3 mt-3">
            <div class="flex justify-between items-center">
              <span class="font-serif text-lg text-stone-800">Estimated Total</span>
              <span class="text-2xl font-bold text-brand">{formatCurrency(total)}</span>
            </div>
            <div class="flex justify-between items-center mt-1">
              <span class="text-sm text-stone-500">Per person ({groupSize} guests)</span>
              <span class="text-sm font-medium text-stone-600">{formatCurrency(perPerson)}</span>
            </div>
          </div>
        </div>

        {/* Get a Quote CTA */}
        <button
          type="button"
          onClick={handleGetQuote}
          class="w-full mt-6 px-6 py-3 bg-brand text-white rounded-lg font-medium hover:bg-brand-dark transition-colors focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Get a Quote
        </button>

        {/* Disclaimer */}
        <p class="text-base text-stone-400 mt-6 pt-4 border-t border-stone-100">
          This is an estimate. Final pricing confirmed upon booking.
        </p>
      </div>
    </div>
  );
}
