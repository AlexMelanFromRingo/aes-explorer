import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  features = [
    {
      icon: 'cube',
      title: 'Block Cipher Structure',
      description: '128-bit block size with 128/192/256-bit keys. Operates on 4x4 byte state matrix.',
      badge: '128-bit',
      badgeClass: 'badge'
    },
    {
      icon: 'layers',
      title: 'Round Operations',
      description: 'SubBytes, ShiftRows, MixColumns, AddRoundKey - four transformations per round.',
      badge: '10-14 rounds',
      badgeClass: 'badge badge--green'
    },
    {
      icon: 'shield',
      title: 'Military-Grade Security',
      description: 'NIST standard since 2001. No practical attacks known against full AES.',
      badge: 'FIPS 197',
      badgeClass: 'badge badge--gold'
    },
    {
      icon: 'zap',
      title: 'Hardware Acceleration',
      description: 'AES-NI instructions in modern CPUs enable billions of operations per second.',
      badge: 'AES-NI',
      badgeClass: 'badge badge--purple'
    }
  ];

  stats = [
    { value: '2001', label: 'NIST Standard' },
    { value: '128', label: 'Bit Block Size' },
    { value: '10+', label: 'Encryption Rounds' },
    { value: '2^128', label: 'Key Combinations' }
  ];

  ctaBytes = [0x32, 0x88, 0x31, 0xe0, 0x43, 0x5a, 0x31, 0x37, 0xf6, 0x30, 0x98, 0x07, 0xa8, 0x8d, 0xa2, 0x34];
}
