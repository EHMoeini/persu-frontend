'use client';

import { DEFAULT_CAMERA } from '../../engineConfig';
import { LowPolyScene } from '../../LowPolyScene';
import type { SceneProps } from '../../types';
import { buildFootballScene } from './buildScene';

export function FootballScene({ idle, className }: SceneProps) {
    return (
        <LowPolyScene
            build={buildFootballScene}
            camera={DEFAULT_CAMERA}
            idle={idle}
            className={className}
        />
    );
}
