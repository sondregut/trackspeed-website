import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import {GeistSans} from 'geist/font/sans';
import {GeistMono} from 'geist/font/mono';
import styles from './jump.module.css';

export const metadata: Metadata = {
  applicationName: 'TrackJump',
  itunes: null,
  openGraph: {
    title: 'TrackJump',
    description: 'Jump testing for iPhone, from the TrackSpeed family. In development.',
    siteName: 'TrackJump',
    images: ['/jump/share-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrackJump',
    description: 'Jump testing for iPhone, from the TrackSpeed family. In development.',
    images: ['/jump/share-image'],
  },
};

export default function JumpLayout({children}: {children: ReactNode}) {
  return <div className={`${styles.scope} ${GeistSans.variable} ${GeistMono.variable}`}>{children}</div>;
}
