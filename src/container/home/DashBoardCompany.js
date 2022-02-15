import React, { useState, useRef, useEffect } from 'react';

import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { AppStyles, AppSizes, AppColors } from "@theme"
import PagerView from 'react-native-pager-view';
import { HomeScreenCompany, ApproveRequest, GroupUserPerfomance, MonthlyScheduled, DailySchedule, WorkingPerformance } from "@container"
import NavigationBar from '@navigation/NavigationBar';
import { useSelector, useDispatch } from 'react-redux';
import { countWaitingApprove } from "@notification"
import { TabActions } from '@react-navigation/native';
import { ButtonIconComponent } from '@component'
import _ from 'lodash'
const NUMBER_OF_PAGES = 2
const DashBoardCompany = ({ navigation, route }) => {
    const viewPagerRef = useRef(null)
    const [currentPage, setCurentPage] = useState(0)
    const dispatch = useDispatch()

    const onPageSelected = (e) => {
        const pos = e.nativeEvent.position
        setCurentPage(pos)
    }
    const onNextPage = _.throttle(() => {
        const mCurrentPage = currentPage + 1
        setCurentPage(mCurrentPage)
        viewPagerRef.current.setPage(mCurrentPage)
    }, 500)

    const onPrePage = _.debounce(() => {
        const mCurrentPage = currentPage - 1
        setCurentPage(mCurrentPage)
        viewPagerRef.current.setPage(mCurrentPage)
    }, 500)

    return (
        <View style={[AppStyles.container, { padding: 0 }]}>
            <NavigationBar
                containerStyle={{ padding: AppSizes.padding }}
                leftView={() => <Text style={[AppStyles.boldText, { fontSize: 24 }]}>Dashboard Company</Text>}/>
            <PagerView
                onPageSelected={onPageSelected}
                ref={viewPagerRef}
                scrollEnabled={true}
                showPageIndicator={true}
                style={styles.pagerView}
                initialPage={currentPage}>
                <View style={{ flex: 1 }}>
                    <HomeScreenCompany />
                </View>
                <View style={{ flex: 1 }}>
                    <MonthlyScheduled />
                </View>
            </PagerView>
            {
                currentPage !== NUMBER_OF_PAGES - 1 && <ButtonIconComponent
                    containerStyle={{ position: 'absolute', zIndex: 1000, top: AppSizes.screen.height / 2, right: 30, }}
                    name="arrow-with-circle-right"
                    size={40}
                    color="rgba(180, 180, 180, 0.6)"
                    action={onNextPage} />
            }
            {
                currentPage !== 0 &&
                <ButtonIconComponent
                    containerStyle={{ position: 'absolute', zIndex: 1000, top: AppSizes.screen.height / 2, left: 30, }}
                    name="arrow-with-circle-left"
                    size={40}
                    color="rgba(180, 180, 180, 0.6)"
                    action={onPrePage} />
            }

        </View>
    );
};

const styles = StyleSheet.create({
    pagerView: {
        flex: 1,
        margin: 0,
        padding: 0
    },
    rightView: {
        ...AppStyles.roundButton,
        height: 45,
        minWidth: 110,
        alignItems: 'center',
        flexDirection: 'row',
        padding: AppSizes.paddingSmall,
        backgroundColor: 'transparent',
        borderWidth: 0
    },

    redCircle: {
        overflow: 'hidden',
        borderRadius: 17,
        borderColor: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white',
        padding: AppSizes.paddingSmall,
        minWidth: 35,
        minHeight: 35,
        backgroundColor: AppColors.danger
    },
});

export default DashBoardCompany