'use client';

import { useState } from 'react';

import { useFooterInView } from '../facility.hook';
import { DEFAULT_SELECTED_SLOT, FACILITY_DETAIL, toSelectedSlot } from '../facility.logic';
import type { IFacilityDay, ISelectedSlot, TAvailableSlot } from '../facility.models';

import { FacilityBookingBar } from './facility-booking-bar';
import { FacilityGallery } from './facility-gallery';
import { FacilityOverview } from './facility-overview';
import { FacilityReviews } from './facility-reviews';
import { FacilitySchedule } from './facility-schedule';
import { FacilityTopBar } from './facility-top-bar';

/**
 * The facility detail screen. The demo record is static for now, so the only
 * state is the Time Slot selected in the weekly table and mirrored in the
 * sticky booking bar.
 */
export function FacilityScreen() {
    const [selection, setSelection] = useState<ISelectedSlot>(DEFAULT_SELECTED_SLOT);
    const footerInView = useFooterInView();

    const selectSlot = (day: IFacilityDay, slot: TAvailableSlot) => {
        setSelection(toSelectedSlot(day, slot));
    };

    return (
        <div className="flex w-full flex-col pb-[calc(env(safe-area-inset-bottom)+10rem)]">
            <FacilityTopBar name={FACILITY_DETAIL.name} />
            <FacilityGallery detail={FACILITY_DETAIL} />
            <FacilityOverview detail={FACILITY_DETAIL} />
            <FacilityReviews detail={FACILITY_DETAIL} />
            <FacilitySchedule
                schedule={FACILITY_DETAIL.schedule}
                selectedSlotKey={selection.key}
                onSelectSlot={selectSlot}
            />
            <FacilityBookingBar selection={selection} hidden={footerInView} />
        </div>
    );
}
