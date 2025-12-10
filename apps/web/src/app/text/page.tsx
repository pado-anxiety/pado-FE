'use client';

import { Text } from '@nyangtodac/ui';

export default function TextPage() {
  return (
    <div className="flex flex-col gap-2 p-4">
      <Text
        tx="hello"
        className="text-title-large text-body"
      />
      <Text
        tx="hello"
        className="text-title-medium text-body"
      />
      <Text
        tx="hello"
        className="text-title-small text-body"
      />

      <Text
        tx="hello"
        className="text-body-large text-body"
      />
      <Text
        tx="hello"
        className="text-body-medium text-body"
      />
      <Text
        tx="hello"
        className="text-body-small text-body"
      />

      <Text
        tx="hello"
        className="text-label-large text-body"
      />
      <Text
        tx="hello"
        className="text-label-medium text-body"
      />
      <Text
        tx="hello"
        className="text-label-small text-body"
      />
    </div>
  );
}
