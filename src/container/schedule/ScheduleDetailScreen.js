import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
import { useDispatch, useSelector } from 'react-redux'
import { API } from '@network';
import { LoadingComponent, ButtonComponent, DropdownComponent, ButtonIconComponent, Dialog, BaseInputViewComponent } from '@component';
import { utils, RouterName } from '@navigation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DateTimeUtil } from "@utils"
import _ from 'lodash'
import { Helper, actionStatus } from '@schedule';
import RNFS from 'react-native-fs'
import { Divider } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import { AppConfig } from '@constant/';
import moment from 'moment';
import { workTypeValues } from "@schedule/WorkTypes";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScheduleStatus } from "@schedule"
import { getExtension } from '@utils/string';

const MAX_DROPDOWM_WIDTH = 135
const DROPDOWN_HEIGHT = 35

const ScheduleDetailScreen = ({ route, navigation }) => {
    const { schedule, callback } = route.params
    const isFirstRender = useRef(true);
    const insets = useSafeAreaInsets();
    const [comment, setComment] = useState(schedule?.schedule_data?.comment ?? "")
    const [isLoading, setLoading] = useState(false)
    const [scheduleData, setScheduleData] = useState(schedule)
    const [attachments, setAttachments] = useState(schedule?.schedule_data?.attachment ?? [])
    const [customer_number, setCustomerNumber] = useState(schedule?.schedule_data?.customer_number ?? 0)
    const [tvv_number, setTvvNumber] = useState(schedule?.schedule_data?.tvv_number ?? 0)
    const [afyp, setAfyp] = useState(schedule?.schedule_data?.afyp ?? 0)

    // const [recruiter, setRecruiter] = useState(schedule?.schedule_data?.recruiter ?? 0)
    // const []


    const account = useSelector((state) => {
        return state?.user?.account ?? {}
    })
    const isEnable = account?.user_id == schedule?.user_id
    const workType = Helper.getWorkTypeName(scheduleData?.schedule_data?.work_type ?? "")
    const for_user = scheduleData?.schedule_data?.for_user ?? ""
    const from_user = scheduleData?.schedule_data?.from_user ?? (scheduleData?.schedule_data?.form_user ?? "")
    const content = scheduleData?.schedule_data?.name ?? ""
    const isToChucSuKien = scheduleData?.schedule_data?.work_type?.toString()?.charAt(0) == workTypeValues.HNKH
    const isBNNN = scheduleData?.schedule_data?.work_type?.toString()?.charAt(0) == workTypeValues.hoiNghiTuyenDung

    const updateStatus = (status) => {

        const params = {
            id: scheduleData?.id,
            status,
            _method: "put",
            submit: 1
        }
        setLoading(true)
        API.updateSchedule(params)
            .then(res => {
                if (res?.data?.success) {
                    callback && callback()
                    utils.showBeautyAlert("success", "C???p nh???t th??nh c??ng")
                    setScheduleData(Object.assign({}, scheduleData, { status }))
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false)
            })
    }

    const getDefaultValue = (status) => {
        return _.filter(actionStatus, i => i.value == status)?.[0] ?? { label: "??ang ch???y", value: status.pending }
    }

    const deleteSchedule = () => {
        Alert.alert("Ch?? ??", "B???n c?? ch???c ch???n mu???n x??a c??ng vi???c n??y?", [
            {
                text: "H???y",
                onPress: () => {
                },
                style: "cancel"
            },
            {
                text: "X??a",
                onPress: () => {
                    const params = {
                        id: scheduleData.id,
                        submit: 1,
                        _method: 'DELETE'
                    }
                    setLoading(true)
                    API.deleteSchedule(params)
                        .then(res => {
                            if (res?.data?.success) {
                                utils.showBeautyAlert("success", "X??a th??nh c??ng")
                                navigation.goBack()
                                callback && callback()
                            }
                        })
                        .catch(err => console.error(err))
                        .finally(() => {
                            setLoading(false)
                        })
                }
            }
        ])
    }

    const viewFile = (item) => {
        let { url, name } = item
        if (Platform.OS === 'android') {
            const extension = getExtension(name)
            if (!_.includes(['png', 'jpg', 'jpeg', 'bmp', 'svg', 'gif'], extension?.toLowerCase())) {
                url = 'http://docs.google.com/gview?embedded=true&url=' + url
            }
        }
        navigation.navigate(
            RouterName.baseWebViewScreen,
            {
                url,
                title: name,
            })
    }

    const downloadFile = (item) => {
        const params = {
            library_record_id: item.id,
            submit: 1
        }
        setLoading(true)
        API.downloadFile(params)
            .then(res => {
                const item = res?.data?.result ?? {}
                const file_content = item?.file_content ?? ""
                const fileName = item?.file_name ?? ""
                const ext = "." + item.file_type ?? ''
                const path = Platform.OS == "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath
                const localFile = `${path}/${fileName}${ext}`;

                RNFS.writeFile(localFile, file_content, 'base64')
                    .then(() => {
                        utils.showBeautyAlert("success", "T???i file th??nh c??ng. Vui l??ng xem file trong m???c t???i v??? c???a ??i???n tho???i.")
                    })
                    .catch(error => console.log(error.message));
            })
            .catch(err => {
                utils.showBeautyAlert("fail", "C?? l???i trong qu?? tr??nh t???i file.")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const updateSchedule = () => {
        const schedule_data = scheduleData?.schedule_data
        schedule_data.attachment = attachments
        schedule_data.tvv_number = tvv_number
        schedule_data.customer_number = customer_number
        schedule_data.afyp = afyp
        const params = {
            id: scheduleData.id,
            schedule_data,
            _method: "put",
            submit: 1
        }
        setLoading(true)
        API.scheduleUpdate(params)
            .then(res => {
                if (res?.data?.success) {
                    callback && callback()
                    utils.showBeautyAlert("success", "C???p nh???t th??nh c??ng")
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false)
            })
    }

    const uploadFilesToServer = (photo) => {
        var photo = {
            uri: photo.path,
            // uri: photo.sourceURL,
            type: photo.mime,
            name: photo.filename ?? `image_${new Date().getTime()}`
        };

        //use formdata
        var formData = new FormData();
        formData.append('upload_file', photo);
        formData.append("submit", 1)
        formData.append("uploadFileField", "upload_file")

        setLoading(true)
        API.uploadFileSchedule(formData)
            .then(res => {
                if (res?.data?.success) {
                    const baseURL = AppConfig.API_BASE_URL[API.env]
                    const photoUrl = baseURL + '/' + res?.data?.result?.path ?? ""
                    const attachment = {
                        id: res?.data?.result?.id ?? 0,
                        name: res?.data?.result?.name ?? "",
                        status: 'done',
                        uid: `rc-upload-${moment().valueOf()}`,
                        url: photoUrl,
                    }
                    const temp_attachments = [...attachments, attachment]
                    setAttachments(temp_attachments)
                } else {
                    Alert.alert("C?? l???i x???y ra", "Vui l??ng th??? l???i!!!")
                }

            })
            .catch(error => {
                Alert.alert("C?? l???i x???y ra", "Vui l??ng th??? l???i!!!")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleOpenCamera = () => {
        Dialog.hide()
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            uploadFilesToServer(image)
        });
    }

    const handleOpenPhotoFromLibrary = () => {
        Dialog.hide()
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            uploadFilesToServer(image)
        });
    }


    const uploadFiles = () => {
        const dialogOption = {
            navigation,
            positiveText: null,
            title: 'Vui l??ng ch???n ngu???n ???nh',
            negativeText: "Tho??t",
            customContent: <View>
                <TouchableOpacity style={{ padding: AppSizes.padding }} onPress={handleOpenPhotoFromLibrary}>
                    <Text style={[AppStyles.baseText, { color: AppColors.balck, textAlign: 'center' }]}>Ch???n ???nh t??? th?? vi???n</Text>
                </TouchableOpacity>
                <Divider style={{ marginHorizontal: '10%' }} />
                <TouchableOpacity style={{ padding: AppSizes.padding }} onPress={handleOpenCamera}>
                    <Text style={[AppStyles.baseText, { color: AppColors.balck, textAlign: 'center' }]}>Ch???p ???nh</Text>
                </TouchableOpacity>
                <Divider />

            </View>
        }
        Dialog.show(dialogOption)
    }

    const removeFile = (item) => {

        Alert.alert("Ch?? ??", "B???n c?? ch???c ch???n mu???n x??a file n??y?", [
            {
                text: "H???y",
                onPress: () => {
                },
                style: "cancel"
            },
            {
                text: "X??a",
                onPress: () => {
                    const temp_attachments = attachments.filter(attachment => attachment.id != item.id)
                    updateSchedule(temp_attachments)
                    setAttachments(temp_attachments)
                }
            }
        ])


    }

    const renderAttachment = () => {
        if (attachments.length > 0) {
            return (
                <View style={styles.attachmentContainer}>
                    <View style={styles.attachmentContent}>
                        {
                            attachments.map((item, index) => {
                                return (
                                    <View key={index} style={styles.attachmentItem}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={[AppStyles.baseTextGray, { flex: 1 }]}>{item.name}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            {
                                                isEnable && <ButtonIconComponent
                                                    containerStyle={{ marginRight: AppSizes.padding }}
                                                    source="AntDesign"
                                                    name="close"
                                                    size={25}
                                                    color={AppColors.danger}
                                                    action={() => removeFile(item)} />
                                            }

                                            <ButtonIconComponent
                                                name="eye"
                                                size={25}
                                                color={AppColors.primaryBackground}
                                                action={() => viewFile(item)} />
                                        </View>

                                    </View>
                                )
                            })
                        }
                    </View>
                </View>
            )
        } else {
            return <View>
                <Text style={AppStyles.baseTextGray}>Kh??ng c?? file ????nh k??m</Text>
            </View>
        }
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return
        }
        //update schedule
        updateSchedule()

    }, [afyp, tvv_number, customer_number, attachments])

    const editReportHNKH = () => {
        navigation.navigate("ScheduleReport", {
            callback: (data) => {
                if (data) {
                    callback && callback()
                    setAfyp(data.afyp)
                    setTvvNumber(data.tvv_number)
                    setCustomerNumber(data.customer_number)
                }
            },
            schedule,
        })
    }

    const editReport = () => {
        navigation.navigate("ScheduleCommentReport", {
            callback: (data) => {
                if (data) {
                    callback && callback()
                    setComment(data?.comment)
                }
            },
            schedule,
        })
    }

    const editReportBNNN = () => {
        navigation.navigate("ScheduleBNNNReport", {
            callback: (data) => {
                if (data) {
                    const tem = _.cloneDeep(scheduleData)
                    tem.schedule_data = data
                    setScheduleData(tem)
                }
            },
            schedule,
        })
    }

    const showActionSheet = () => {
        SheetManager.show("action_sheet");
    }

    return (
        <View style={[AppStyles.container]}>
            <NavigationBar
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="K??? ho???ch chi ti???t" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ margin: AppSizes.paddingXSmall, paddingBottom: AppSizes.padding }}>
                <View style={AppStyles.baseBox}>
                    <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingXSmall, fontSize: AppSizes.fontLarge }]} numberOfLines={2} ellipsizeMode="tail">
                        {workType}
                    </Text>
                    <Text style={[AppStyles.baseTextGray]}>
                        {!!content ? content : "Ch??a c??"}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: AppSizes.paddingXSmall }}>
                        <Text style={[AppStyles.boldTextGray, { color: AppColors.primaryBackground, marginTop: AppSizes.paddingSmall }]}>
                            {DateTimeUtil.format("HH:mm dddd DD/MM/YYYY", (scheduleData?.start_ts ?? 0) * 1000)}
                        </Text>

                    </View>
                    <Text style={[AppStyles.baseTextGray]} numberOfLines={2} ellipsizeMode="tail">
                        Ng?????i th???c hi???n: {!!for_user ? for_user : "Ch??a c??"}
                    </Text>
                    <Text style={[AppStyles.baseTextGray, { paddingVertical: AppSizes.paddingXSmall }]} numberOfLines={2} ellipsizeMode="tail">
                        Ng?????i giao vi???c: {!!from_user ? from_user : "Ch??a c??"}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.padding }]}>
                            Tr???ng th??i:
                        </Text>

                        <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.padding, color: Helper.getStatusColor(scheduleData.status) }]}>
                            {Helper.getStatus(scheduleData.status, scheduleData)}
                        </Text>
                    </View>
                    {
                        isEnable && <ButtonIconComponent
                            name="ellipsis-vertical-circle-sharp"
                            source="Ionicons"
                            action={() => { showActionSheet() }}
                            color="#41cd7d"
                            size={35}
                            containerStyle={{ position: 'absolute', right: AppSizes.paddingSmall, top: AppSizes.paddingSmall }}
                        />
                    }


                </View>
                {
                    (!isToChucSuKien && !isBNNN) && <View style={{ ...AppStyles.baseBox, marginTop: AppSizes.padding }}>
                        <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingXSmall, fontSize: AppSizes.fontLarge }]} numberOfLines={2} ellipsizeMode="tail">
                            B??o c??o k???t qu???
                        </Text>
                        <Text style={[AppStyles.baseTextGray,]}>
                            {comment || "Ch??a c?? b??o c??o"}
                        </Text>

                        {
                            isEnable && <ButtonComponent
                                textStyle={{ color: AppColors.primaryBackground }}
                                containerStyle={{ ...AppStyles.roundButton, borderColor: 'gray', width: 180, alignSelf: 'center', backgroundColor: AppColors.white, marginVertical: AppSizes.padding, }}
                                title="B??o c??o"
                                action={editReport} />
                        }

                    </View>
                }
                {
                    isToChucSuKien && <View style={{ ...AppStyles.baseBox, marginTop: AppSizes.padding }}>
                        <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingXSmall, fontSize: AppSizes.fontLarge }]} numberOfLines={2} ellipsizeMode="tail">
                            B??o c??o k???t qu???
                        </Text>
                        <Text style={[AppStyles.baseTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                            {customer_number} Kh??ch h??ng/???ng vi??n tham gia
                        </Text>
                        <Text style={[AppStyles.baseTextGray, { marginVertical: AppSizes.paddingXSmall }]} numberOfLines={2} ellipsizeMode="tail">
                            {tvv_number} TVV tham gia
                        </Text>
                        <Text style={[AppStyles.baseTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                            {afyp} tr?? AFYP
                        </Text>
                        {
                            isEnable && <ButtonComponent
                                textStyle={{ color: AppColors.primaryBackground }}
                                containerStyle={{ ...AppStyles.roundButton, borderColor: 'gray', width: 180, alignSelf: 'center', backgroundColor: AppColors.white, marginVertical: AppSizes.padding, }}
                                title="B??o c??o"
                                action={editReportHNKH} />
                        }

                    </View>
                }
                {
                    isBNNN && <View style={{ ...AppStyles.baseBox, marginTop: AppSizes.padding }}>
                        <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingXSmall, fontSize: AppSizes.fontLarge }]} numberOfLines={2} ellipsizeMode="tail">
                            B??o c??o k???t qu???
                        </Text>
                        <Text style={[AppStyles.baseTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                            T??n ng?????i tuy???n d???ng:{scheduleData?.schedule_data?.recruiter ?? ""}
                        </Text>
                        <Text style={[AppStyles.baseTextGray, { marginVertical: AppSizes.paddingXSmall }]} numberOfLines={2} ellipsizeMode="tail">
                            {scheduleData?.schedule_data?.candidate_number ?? 0} ???ng vi??n tham d???
                        </Text>
                        <Text style={[AppStyles.baseTextGray,]} numberOfLines={2} ellipsizeMode="tail">
                            {scheduleData?.schedule_data?.candidate_number_join ?? 0} ???ng vi??n ?????ng ?? h???c BVLN
                        </Text>
                        {
                            isEnable && <ButtonComponent
                                textStyle={{ color: AppColors.primaryBackground }}
                                containerStyle={{ ...AppStyles.roundButton, borderColor: 'gray', width: 180, alignSelf: 'center', backgroundColor: AppColors.white, marginVertical: AppSizes.padding, }}
                                title="B??o c??o"
                                action={editReportBNNN} />
                        }
                    </View>
                }

                <View style={{ ...AppStyles.baseBox, marginTop: AppSizes.padding }}>
                    <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingXSmall, fontSize: AppSizes.fontLarge }]} numberOfLines={2} ellipsizeMode="tail">
                        File Upload
                    </Text>
                    {
                        renderAttachment()
                    }
                    {
                        isEnable && <ButtonComponent
                            action={() => { uploadFiles() }}
                            textStyle={{ color: AppColors.primaryBackground }}
                            title="T???i l??n"
                            containerStyle={{ ...AppStyles.roundButton, borderColor: 'gray', width: 180, alignSelf: 'center', backgroundColor: AppColors.white, marginVertical: AppSizes.padding }}
                        />
                    }
                </View>
                {
                    isEnable && <ButtonComponent
                        textStyle={{ color: AppColors.danger }}
                        containerStyle={{ ...AppStyles.roundButton, borderColor: 'gray', width: 180, alignSelf: 'center', backgroundColor: AppColors.white, marginVertical: AppSizes.paddingLarge, }}
                        title="X??a c??ng vi???c"
                        action={() => deleteSchedule()} />

                }
            </ScrollView>
            {
                isLoading && <LoadingComponent />
            }
            <ActionSheet id="action_sheet">
                <View style={{ minHeight: 150, paddingTop: AppSizes.paddingLarge }}>
                    <ButtonComponent
                        containerStyle={styles.itemActionSheet}
                        title="Ho??n th??nh"
                        textStyle={AppStyles.baseTextGray}
                        action={async () => {
                            await SheetManager.hide("action_sheet");
                            updateStatus(ScheduleStatus.completed);
                        }} />
                    <Divider style={{ width: '80%', alignSelf: 'center' }} />
                    <ButtonComponent
                        containerStyle={styles.itemActionSheet}
                        title="??ang di???n ra"
                        textStyle={AppStyles.baseTextGray}
                        action={async () => {
                            await SheetManager.hide("action_sheet");
                            updateStatus(ScheduleStatus.pending);
                        }} />
                    <Divider style={{ width: '80%', alignSelf: 'center' }} />
                    <ButtonComponent
                        containerStyle={styles.itemActionSheet}
                        title="H???y"
                        textStyle={AppStyles.baseTextGray}
                        action={async () => {
                            await SheetManager.hide("action_sheet");
                            updateStatus(ScheduleStatus.stoped);
                        }} />
                    <Divider style={{ width: '80%', alignSelf: 'center' }} />
                    <ButtonComponent
                        containerStyle={styles.itemActionSheet}
                        title="S???a l???ch"
                        textStyle={AppStyles.baseTextGray}
                        action={async () => {
                            await SheetManager.hide("action_sheet");
                            navigation.navigate(RouterName.createSchedule, { scheduleData: scheduleData, isEdit: true, callback: () => { navigation.goBack() } });
                        }} />

                </View>
                <ButtonComponent
                    containerStyle={[styles.button, { marginBottom: insets.bottom + AppSizes.paddingXSmall, padding: 0 }]}
                    title="Tho??t"
                    action={async () => {
                        await SheetManager.hide("action_sheet");
                    }} />
            </ActionSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    itemActionSheet: {
        backgroundColor: "transparent",
        alignSelf: "center",
    },
    box: {
        flex: 1,
        ...AppStyles.boxShadow,
        padding: AppSizes.paddingSmall,
        borderColor: 'transparent',
        backgroundColor: AppColors.secondaryBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        margin: AppSizes.paddingSmall,
        marginVertical: AppSizes.paddingSmall
    },
    dropdown: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        width: MAX_DROPDOWM_WIDTH
    },
    dropdownBtnStyle: {
        borderColor: AppColors.grey,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 5,
        width: MAX_DROPDOWM_WIDTH,
        height: DROPDOWN_HEIGHT,
        backgroundColor: 'white'
    },
    dropdownBtnTxtStyle: { color: "#444", textAlign: "left", fontSize: 14 },

    dropdownRowStyle: {
        backgroundColor: "#EFEFEF",
        height: 45,
    },
    dropdownRowTxtStyle: { color: "#444", textAlign: "center", fontSize: 14 },
    baseText: {
        ...AppStyles.baseText,
        color: AppColors.secondaryTextColor, lineHeight: 20
    },
    attachmentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: AppSizes.padding
    },
    button: {
        alignSelf: 'center',
        width: 180,
        height: 45,
        marginTop: AppSizes.padding
    },
})


export default ScheduleDetailScreen;