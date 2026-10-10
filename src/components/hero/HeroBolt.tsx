import { useMemo } from 'react';
import {
  buildBolt,
  buildNut,
  buildWasher,
  NUT_ASSEMBLED_X,
  WASHER_ASSEMBLED_X,
} from '../../lib/geometry';
import { useFastenerMaterial } from './useFastenerMaterial';

type Props = {
  finishId?: string;
  /** Show nut + washer pre-assembled, seated exactly as the journey starts (used by Final CTA §24). */
  assembled?: boolean;
  /** Composition offset: desktop right-weighted [1.0, -0.05, 0], mobile stacked [0, 0.75, 0]. */
  shift?: [number, number, number];
};

/** Hero bolt: detailed hex head, beveled edges, real helical thread geometry. */
export function HeroBolt({ finishId = 'stainless', assembled = false, shift = [0.4, -0.1, 0] }: Props) {
  const material = useFastenerMaterial(finishId);

  const { bolt, nut, washer } = useMemo(() => {
    const b = buildBolt(material);
    const n = buildNut(material);
    const w = buildWasher(material);
    return { bolt: b.group, nut: n, washer: w };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material]);

  return (
    <group rotation={[0.15, 0, -0.5]} position={shift}>
      <primitive object={bolt} />
      {assembled && (
        <>
          <primitive object={nut} position={[NUT_ASSEMBLED_X, 0, 0]} />
          <primitive object={washer} position={[WASHER_ASSEMBLED_X, 0, 0]} />
        </>
      )}
    </group>
  );
}
