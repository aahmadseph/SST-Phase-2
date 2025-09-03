/* eslint-disable max-len */
import LegacyIcon from 'components/LegacyIcon/LegacyIcon';
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

function IconWrite(fullProps) {
    return (
        <LegacyIcon
            {...fullProps}
            viewBox='0 0 32 32'
        >
            <path d='M2.5 32c-.667 0-1.294-.26-1.767-.733C.26 30.793 0 30.165 0 29.497L.003 4.502c0-1.378 1.122-2.5 2.5-2.5h13.9c.55 0 1 .448 1 1s-.45 1-1 1h-13.9c-.27 0-.5.23-.5.5L2 29.5c0 .178.092.297.147.353.056.054.175.147.353.147l25-.003c.27 0 .5-.23.5-.5v-13.9c0-.55.447-1 1-1s1 .45 1 1v13.9c0 1.378-1.122 2.5-2.5 2.5L2.5 32z' />
            <path d='M7 26c-.263 0-.518-.104-.707-.293-.236-.236-.34-.575-.273-.903l1.274-6.372c.097-.484.333-.927.683-1.277L24.84.293c.215-.215.52-.323.82-.287 3.344.386 5.948 2.99 6.333 6.334.035.303-.07.605-.286.82l-16.86 16.86c-.35.35-.79.587-1.276.686L7.197 25.98c-.065.013-.13.02-.196.02zM25.893 2.067l-16.5 16.5c-.07.07-.118.16-.137.256l-.98 4.902 4.9-.98c.098-.02.187-.067.256-.137l16.5-16.5c-.418-2.04-2-3.622-4.04-4.04z' />
        </LegacyIcon>
    );
}

export default wrapFunctionalComponent(IconWrite, 'IconWrite');
