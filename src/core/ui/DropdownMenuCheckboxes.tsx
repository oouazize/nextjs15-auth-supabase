'use client';
import React, { useState } from 'react';
import Button from '~/core/ui/Button';
import { Checkbox } from './Checkbox';

type Option = {
  label: string;
  disabled?: boolean;
};

type Props = {
  selectedOptionsRef?: string[];
  options: Option[];
  onOptionChange: (label: string, checked?: boolean) => void;
};

export function DropdownMenuCheckboxes({
  selectedOptionsRef,
  options,
  onOptionChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [checkedStates, setCheckedStates] = React.useState<
    Record<string, boolean>
  >(
    options.reduce(
      (obj, option) => ({
        ...obj,
        [option.label]: selectedOptionsRef?.includes(option.label) || false,
      }),
      {},
    ),
  );
  const handleCheckedChange = (label: string, checked: boolean) => {
    setCheckedStates((prev) => ({ ...prev, [label]: checked }));
  };

  const isAnyOptionSelected = Object.values(checkedStates).some(
    (value) => value,
  );

  return (
    <div className="relative">
      <Button
        className="w-full"
        variant={isAnyOptionSelected ? 'default' : 'secondary'}
        onClick={(event) => {
          event.preventDefault();
          setOpen((prev) => !prev);
        }}
      >
        Select
      </Button>
      {open && (
        <div className="absolute z-10 bg-dark border border-border rounded shadow flex flex-col">
          <div className="overflow-auto max-h-60">
            {options.map((option, index) => (
              <div
                key={index}
                className={`p-2 flex gap-2 hover:text-white hover:bg-primary/50 ${checkedStates[option.label] ? 'bg-primary text-black' : ''}`}
              >
                <Checkbox
                  checked={checkedStates[option.label]}
                  onCheckedChange={() => {
                    handleCheckedChange(
                      option.label,
                      !checkedStates[option.label],
                    );
                    onOptionChange(option.label, !checkedStates[option.label]);
                  }}
                />
                {option.label}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border">
            <Button
              onClick={(event) => {
                event.preventDefault();
                setOpen(false);
              }}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
