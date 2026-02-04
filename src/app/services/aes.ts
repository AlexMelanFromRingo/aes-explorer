import { Injectable, signal, computed } from '@angular/core';

export interface AesStep {
  name: string;
  description: string;
  stateBefore: number[][];
  stateAfter: number[][];
  roundKey?: number[][];
  round: number;
}

export interface AesEncryptionResult {
  plaintext: number[];
  ciphertext: number[];
  key: number[];
  expandedKey: number[][];
  steps: AesStep[];
}

@Injectable({
  providedIn: 'root',
})
export class AesService {
  // AES S-Box (Substitution Box)
  readonly sBox: number[] = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
    0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
    0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
    0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
    0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
    0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
    0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
    0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
    0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
    0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
    0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
  ];

  // Inverse S-Box for decryption
  readonly invSBox: number[] = [
    0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
    0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
    0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
    0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
    0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
    0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
    0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
    0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
    0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
    0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
    0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
    0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
    0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
    0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
    0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
    0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d
  ];

  // Round constants for key expansion
  readonly rCon: number[] = [
    0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36
  ];

  // Signals for reactive state
  currentStep = signal<number>(0);
  encryptionSteps = signal<AesStep[]>([]);
  isEncrypting = signal<boolean>(false);

  // Convert string to byte array
  stringToBytes(str: string): number[] {
    const bytes: number[] = [];
    for (let i = 0; i < str.length && bytes.length < 16; i++) {
      bytes.push(str.charCodeAt(i) & 0xff);
    }
    while (bytes.length < 16) {
      bytes.push(0x00);
    }
    return bytes;
  }

  // Convert hex string to byte array
  hexToBytes(hex: string): number[] {
    const cleanHex = hex.replace(/\s/g, '');
    const bytes: number[] = [];
    for (let i = 0; i < cleanHex.length && bytes.length < 16; i += 2) {
      bytes.push(parseInt(cleanHex.substr(i, 2), 16) || 0);
    }
    while (bytes.length < 16) {
      bytes.push(0x00);
    }
    return bytes;
  }

  // Convert bytes to hex string
  bytesToHex(bytes: number[]): string {
    return bytes.map(b => b.toString(16).padStart(2, '0')).join(' ');
  }

  // Convert linear array to 4x4 state matrix (column-major order)
  bytesToState(bytes: number[]): number[][] {
    const state: number[][] = [];
    for (let col = 0; col < 4; col++) {
      state.push([
        bytes[col * 4],
        bytes[col * 4 + 1],
        bytes[col * 4 + 2],
        bytes[col * 4 + 3]
      ]);
    }
    return state;
  }

  // Convert state matrix back to linear array
  stateToBytes(state: number[][]): number[] {
    const bytes: number[] = [];
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        bytes.push(state[col][row]);
      }
    }
    return bytes;
  }

  // Deep copy state matrix
  copyState(state: number[][]): number[][] {
    return state.map(col => [...col]);
  }

  // Key expansion (AES-128)
  expandKey(key: number[]): number[][] {
    const expandedKey: number[][] = [];
    const Nk = 4; // Number of 32-bit words in key (4 for AES-128)
    const Nr = 10; // Number of rounds (10 for AES-128)
    const Nb = 4; // Number of columns in state

    // First Nk words are the original key
    for (let i = 0; i < Nk; i++) {
      expandedKey.push([key[4 * i], key[4 * i + 1], key[4 * i + 2], key[4 * i + 3]]);
    }

    // Generate remaining words
    for (let i = Nk; i < Nb * (Nr + 1); i++) {
      let temp = [...expandedKey[i - 1]];

      if (i % Nk === 0) {
        // RotWord
        temp = [temp[1], temp[2], temp[3], temp[0]];
        // SubWord
        temp = temp.map(b => this.sBox[b]);
        // XOR with Rcon
        temp[0] ^= this.rCon[i / Nk];
      }

      // XOR with word Nk positions earlier
      expandedKey.push([
        expandedKey[i - Nk][0] ^ temp[0],
        expandedKey[i - Nk][1] ^ temp[1],
        expandedKey[i - Nk][2] ^ temp[2],
        expandedKey[i - Nk][3] ^ temp[3]
      ]);
    }

    return expandedKey;
  }

  // Get round key from expanded key
  getRoundKey(expandedKey: number[][], round: number): number[][] {
    const roundKey: number[][] = [];
    for (let i = 0; i < 4; i++) {
      roundKey.push([...expandedKey[round * 4 + i]]);
    }
    return roundKey;
  }

  // SubBytes transformation
  subBytes(state: number[][]): number[][] {
    return state.map(col => col.map(byte => this.sBox[byte]));
  }

  // ShiftRows transformation
  shiftRows(state: number[][]): number[][] {
    const newState = this.copyState(state);

    // Row 1: shift left by 1
    let temp = newState[0][1];
    newState[0][1] = newState[1][1];
    newState[1][1] = newState[2][1];
    newState[2][1] = newState[3][1];
    newState[3][1] = temp;

    // Row 2: shift left by 2
    temp = newState[0][2];
    newState[0][2] = newState[2][2];
    newState[2][2] = temp;
    temp = newState[1][2];
    newState[1][2] = newState[3][2];
    newState[3][2] = temp;

    // Row 3: shift left by 3
    temp = newState[3][3];
    newState[3][3] = newState[2][3];
    newState[2][3] = newState[1][3];
    newState[1][3] = newState[0][3];
    newState[0][3] = temp;

    return newState;
  }

  // Galois Field multiplication
  gmul(a: number, b: number): number {
    let p = 0;
    for (let i = 0; i < 8; i++) {
      if (b & 1) {
        p ^= a;
      }
      const hiBitSet = a & 0x80;
      a <<= 1;
      if (hiBitSet) {
        a ^= 0x1b; // AES irreducible polynomial
      }
      b >>= 1;
    }
    return p & 0xff;
  }

  // MixColumns transformation
  mixColumns(state: number[][]): number[][] {
    const newState: number[][] = [];

    for (let col = 0; col < 4; col++) {
      const s = state[col];
      newState.push([
        this.gmul(0x02, s[0]) ^ this.gmul(0x03, s[1]) ^ s[2] ^ s[3],
        s[0] ^ this.gmul(0x02, s[1]) ^ this.gmul(0x03, s[2]) ^ s[3],
        s[0] ^ s[1] ^ this.gmul(0x02, s[2]) ^ this.gmul(0x03, s[3]),
        this.gmul(0x03, s[0]) ^ s[1] ^ s[2] ^ this.gmul(0x02, s[3])
      ]);
    }

    return newState;
  }

  // AddRoundKey transformation
  addRoundKey(state: number[][], roundKey: number[][]): number[][] {
    const newState: number[][] = [];
    for (let col = 0; col < 4; col++) {
      newState.push([
        state[col][0] ^ roundKey[col][0],
        state[col][1] ^ roundKey[col][1],
        state[col][2] ^ roundKey[col][2],
        state[col][3] ^ roundKey[col][3]
      ]);
    }
    return newState;
  }

  // Full encryption with step tracking
  encrypt(plaintextBytes: number[], keyBytes: number[]): AesEncryptionResult {
    const steps: AesStep[] = [];
    const expandedKey = this.expandKey(keyBytes);

    let state = this.bytesToState(plaintextBytes);

    // Initial round key addition
    const initialKey = this.getRoundKey(expandedKey, 0);
    const stateBeforeInitial = this.copyState(state);
    state = this.addRoundKey(state, initialKey);

    steps.push({
      name: 'AddRoundKey (Initial)',
      description: 'XOR the state with the initial round key',
      stateBefore: stateBeforeInitial,
      stateAfter: this.copyState(state),
      roundKey: initialKey,
      round: 0
    });

    // Main rounds (1-9)
    for (let round = 1; round < 10; round++) {
      // SubBytes
      const stateBeforeSub = this.copyState(state);
      state = this.subBytes(state);
      steps.push({
        name: 'SubBytes',
        description: 'Substitute each byte using the S-Box lookup table',
        stateBefore: stateBeforeSub,
        stateAfter: this.copyState(state),
        round
      });

      // ShiftRows
      const stateBeforeShift = this.copyState(state);
      state = this.shiftRows(state);
      steps.push({
        name: 'ShiftRows',
        description: 'Cyclically shift rows by 0, 1, 2, 3 positions',
        stateBefore: stateBeforeShift,
        stateAfter: this.copyState(state),
        round
      });

      // MixColumns
      const stateBeforeMix = this.copyState(state);
      state = this.mixColumns(state);
      steps.push({
        name: 'MixColumns',
        description: 'Mix columns using Galois Field multiplication',
        stateBefore: stateBeforeMix,
        stateAfter: this.copyState(state),
        round
      });

      // AddRoundKey
      const roundKey = this.getRoundKey(expandedKey, round);
      const stateBeforeAdd = this.copyState(state);
      state = this.addRoundKey(state, roundKey);
      steps.push({
        name: 'AddRoundKey',
        description: 'XOR the state with the round key',
        stateBefore: stateBeforeAdd,
        stateAfter: this.copyState(state),
        roundKey,
        round
      });
    }

    // Final round (no MixColumns)
    const stateBeforeSubFinal = this.copyState(state);
    state = this.subBytes(state);
    steps.push({
      name: 'SubBytes',
      description: 'Final round SubBytes substitution',
      stateBefore: stateBeforeSubFinal,
      stateAfter: this.copyState(state),
      round: 10
    });

    const stateBeforeShiftFinal = this.copyState(state);
    state = this.shiftRows(state);
    steps.push({
      name: 'ShiftRows',
      description: 'Final round ShiftRows',
      stateBefore: stateBeforeShiftFinal,
      stateAfter: this.copyState(state),
      round: 10
    });

    const finalKey = this.getRoundKey(expandedKey, 10);
    const stateBeforeAddFinal = this.copyState(state);
    state = this.addRoundKey(state, finalKey);
    steps.push({
      name: 'AddRoundKey (Final)',
      description: 'Final round key addition',
      stateBefore: stateBeforeAddFinal,
      stateAfter: this.copyState(state),
      roundKey: finalKey,
      round: 10
    });

    return {
      plaintext: plaintextBytes,
      ciphertext: this.stateToBytes(state),
      key: keyBytes,
      expandedKey,
      steps
    };
  }

  // Demonstrate single SubBytes operation
  demonstrateSubBytes(byte: number): { input: number; output: number; row: number; col: number } {
    const row = (byte >> 4) & 0x0f;
    const col = byte & 0x0f;
    return {
      input: byte,
      output: this.sBox[byte],
      row,
      col
    };
  }

  // Demonstrate ShiftRows visually
  demonstrateShiftRows(state: number[][]): { before: number[][]; after: number[][]; shifts: number[] } {
    return {
      before: this.copyState(state),
      after: this.shiftRows(state),
      shifts: [0, 1, 2, 3]
    };
  }

  // Demonstrate MixColumns for one column
  demonstrateMixColumn(column: number[]): { input: number[]; output: number[]; matrix: number[][] } {
    const matrix = [
      [0x02, 0x03, 0x01, 0x01],
      [0x01, 0x02, 0x03, 0x01],
      [0x01, 0x01, 0x02, 0x03],
      [0x03, 0x01, 0x01, 0x02]
    ];

    const output = [
      this.gmul(0x02, column[0]) ^ this.gmul(0x03, column[1]) ^ column[2] ^ column[3],
      column[0] ^ this.gmul(0x02, column[1]) ^ this.gmul(0x03, column[2]) ^ column[3],
      column[0] ^ column[1] ^ this.gmul(0x02, column[2]) ^ this.gmul(0x03, column[3]),
      this.gmul(0x03, column[0]) ^ column[1] ^ column[2] ^ this.gmul(0x02, column[3])
    ];

    return { input: column, output, matrix };
  }
}
