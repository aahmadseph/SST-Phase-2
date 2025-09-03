/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { modal } from 'style/config';
import {
    Flex, Divider, Image, Text, Link
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import Modal from 'components/Modal/Modal';
import Rewards from 'components/Rewards';
import ErrorMsg from 'components/ErrorMsg';
import userUtils from 'utils/User';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/RewardModal/locales', 'RewardModal');

class RewardModal extends BaseClass {
    static propTypes = {
        fetchProfileRewards: PropTypes.func.isRequired,
        showRewardModal: PropTypes.func.isRequired,
        vibSegment: PropTypes.string,
        biPoints: PropTypes.number,
        isRewardInBasket: PropTypes.bool,
        isCBRPromoAppliedInBasket: PropTypes.bool,
        isRewardsAvailable: PropTypes.bool
    };

    componentDidMount() {
        if (this.props.isRewardsAvailable) {
            this.props.fetchProfileRewards();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isRewardsAvailable && this.props.isRewardsAvailable !== prevProps.isRewardsAvailable) {
            this.props.fetchProfileRewards();
        }
    }

    isDone = () => this.props.showRewardModal(false);

    render() {
        const {
            biPoints, isRewardInBasket, isCBRPromoAppliedInBasket, isOpen, vibSegment
        } = this.props;

        const statusDisplay = userUtils.displayBiStatus(vibSegment || userUtils.types.NON_BI);

        return (
            <Modal
                hasBodyScroll
                isOpen={isOpen}
                onDismiss={this.isDone}
                showDismiss={false}
            >
                <Modal.Header>
                    <Flex
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <Modal.Title>{getText('beautyInsiderRewards')}</Modal.Title>
                        <Link
                            color='blue'
                            padding={3}
                            margin={-3}
                            onClick={this.isDone}
                            data-at={Sephora.debug.dataAt('rewards_done_btn')}
                        >
                            {getText('done')}
                        </Link>
                    </Flex>
                    <Divider
                        marginY={3}
                        marginX={modal.outdentX}
                    />
                    <LegacyGrid
                        gutter={4}
                        lineHeight='tight'
                        alignItems='center'
                    >
                        <LegacyGrid.Cell width='fit'>
                            <Image
                                display='block'
                                src={`/img/ufe/bi/logo-${statusDisplay.toLowerCase()}.svg`}
                                height={13}
                                alt={statusDisplay}
                            />
                        </LegacyGrid.Cell>
                        <LegacyGrid.Cell width='fill'>
                            {biPoints < 0 && (isCBRPromoAppliedInBasket || isRewardInBasket) ? (
                                <ErrorMsg
                                    marginBottom={null}
                                    fontSize={null}
                                >
                                    {getText('youAreExceeding')} <b>{Math.abs(biPoints)}</b> {getText('points')}
                                </ErrorMsg>
                            ) : (
                                <Text
                                    is='p'
                                    data-at={Sephora.debug.dataAt('rewards_bi_points')}
                                >
                                    {`${getText('youNowHave')} ${biPoints} ${getText('points')}`}
                                </Text>
                            )}
                        </LegacyGrid.Cell>
                    </LegacyGrid>
                </Modal.Header>
                <Modal.Body>
                    <Rewards />
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(RewardModal, 'RewardModal', true);
