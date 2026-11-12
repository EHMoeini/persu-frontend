'use client';

import { DEFAULT_CAMERA } from '../../engineConfig';
import { LowPolyScene } from '../../LowPolyScene';
import type { SceneProps } from '../../types';
import { buildTennisScene } from './buildScene';

export function TennisScene({ idle, className }: SceneProps) {
    return (
        <LowPolyScene
            build={buildTennisScene}
            camera={DEFAULT_CAMERA}
            idle={idle}
            className={className}
        />
    );
}
