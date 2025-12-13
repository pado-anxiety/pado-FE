'use client';

import Image from 'next/image';

import { Button, Text } from '@nyangtodac/ui';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full max-w-800px flex-col items-start justify-center gap-4 font-family-geist-sans bg-page p-8">
      <main className="flex min-h-screen w-full max-w-800px flex-col items-start justify-center gap-4 font-family-geist-sans">
        <Text
          as="h1"
          tx="hello"
          className="text-title-large text-success"
        />
        <p className="text-title-large text-destructive">hello</p>
        <Button
          text="button"
          color="primary"
          size="default"
          disabled={false}
          fullWidth={false}
        />
        <Image
          className="w-10 h-10"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="text-2xl font-bold">
          <h1 className="text-2xl font-bold text-primary-300">
            To get started, edit the page.tsx file.
          </h1>
          <p className="font-bold text-red-500">hello</p>
          <p className="font-bold text-destructive">hello</p>
          <p className="text-body">
            Looking for a starting point or more instructions? Head over to{' '}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Templates
            </a>{' '}
            or the{' '}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learning
            </a>{' '}
            center.
          </p>
        </div>
      </main>
    </div>
  );
}
