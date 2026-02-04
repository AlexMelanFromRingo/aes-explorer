import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-aes-overview',
  imports: [RouterLink],
  templateUrl: './aes-overview.html',
  styleUrl: './aes-overview.scss',
})
export class AesOverview {
  keyVariants = [
    { bits: 128, rounds: 10, keyWords: 4 },
    { bits: 192, rounds: 12, keyWords: 6 },
    { bits: 256, rounds: 14, keyWords: 8 }
  ];

  roundOperations = [
    {
      name: 'SubBytes',
      description: 'Non-linear byte substitution using S-Box',
      icon: 'substitute',
      color: 'primary'
    },
    {
      name: 'ShiftRows',
      description: 'Cyclical row shifting for diffusion',
      icon: 'shift',
      color: 'accent'
    },
    {
      name: 'MixColumns',
      description: 'Column mixing via Galois Field math',
      icon: 'mix',
      color: 'purple'
    },
    {
      name: 'AddRoundKey',
      description: 'XOR state with round key',
      icon: 'key',
      color: 'gold'
    }
  ];
}
