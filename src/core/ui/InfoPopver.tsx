import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import Button from './Button';

const InfoPopover = ({
  triggerLabel,
  content,
}: {
  triggerLabel: string;
  content: string;
}) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant={'transparent'}>{triggerLabel}</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-gray-800 text-white p-2 rounded-md shadow-md"
          side="top"
          align="center"
          sideOffset={5}
        >
          {content}
          <Popover.Arrow className="fill-gray-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default InfoPopover;
