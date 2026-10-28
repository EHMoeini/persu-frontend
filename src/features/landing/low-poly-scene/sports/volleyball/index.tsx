'use client';

import { DEFAULT_CAMERA } from '../../engineConfig';
import { LowPolyScene } from '../../LowPolyScene';
import type { SceneProps } from '../../types';
import { buildVolleyballScene } from './buildScene';

export function VolleyballScene({ idle, className }: SceneProps) {
    return (
        <LowPolyScene
            build={buildVolleyballScene}
            camera={DEFAULT_CAMERA}
            idle={idle}
            className={className}
        />
    );
}
