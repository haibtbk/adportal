import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { AppSizes, AppStyles, AppColors } from '@theme';
import NavigationBar from '@navigation/NavigationBar';
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


const MAX_DROPDOWM_WIDTH = 135
const DROPDOWN_HEIGHT = 35

const ScheduleDetailScreen = ({ route, navigation }) => {
    const { schedule, callback } = route.params
    const isFirstRender = useRef(true);

    const [isLoading, setLoading] = useState(false)
    const [scheduleData, setScheduleData] = useState(schedule)
    const [attachments, setAttachments] = useState(schedule?.schedule_data?.attachment ?? [])
    const [customer_number, setCustomerNumber] = useState(schedule?.schedule_data?.customer_number ?? 0)
    const [tvv_number, setTvvNumber] = useState(schedule?.schedule_data?.tvv_number ?? 0)
    const [afyp, setAfyp] = useState(schedule?.schedule_data?.afyp ?? 0)

    const workType = Helper.getWorkHeader(scheduleData?.schedule_data?.work_type ?? "")
    const for_user = scheduleData?.schedule_data?.for_user ?? ""
    const content = scheduleData?.schedule_data?.name ?? ""
    const isToChucSuKien = _.includes(scheduleData?.schedule_data?.work_type, workTypeValues.toChucHoiNghi)


    const onChangeValueStatus = (item, itemSchedule) => {

        if (item.value == -1) { //xoa ban ghi
            Alert.alert("Chú ý", "Bạn có chắc chắn muốn xóa lịch này?", [
                {
                    text: "Hủy",
                    onPress: () => {
                    },
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    onPress: () => {
                        const params = {
                            id: itemSchedule.id,
                            submit: 1,
                            _method: 'DELETE'
                        }
                        setLoading(true)
                        API.deleteSchedule(params)
                            .then(res => {
                                if (res?.data?.success) {
                                    utils.showBeautyAlert(navigation, "success", res?.data?.message ?? "Xóa thành công")
                                }
                                refreshData()
                            })
                            .catch(err => console.error(err))
                            .finally(() => {
                                setLoading(false)
                            })
                    }
                }
            ])


            return
        }

        const params = {
            id: itemSchedule.id,
            status: item.value,
            _method: "put",
            submit: 1
        }
        setLoading(true)
        API.updateSchedule(params)
            .then(res => {
                if (res?.data?.success) {
                    callback && callback()
                    utils.showBeautyAlert(navigation, "success", res?.data?.message ?? "Cập nhật thành công")
                    setScheduleData(Object.assign({}, scheduleData, { status: item.value }))
                }
            })
            .catch(err => console.error(err))
            .finally(() => {
                setLoading(false)
            })
    }

    const getDefaultValue = (status) => {
        return _.filter(actionStatus, i => i.value == status)?.[0] ?? { label: "Đang chạy", value: status.pending }
    }

    const deleteSchedule = () => {
        Alert.alert("Chú ý", "Bạn có chắc chắn muốn xóa công việc này?", [
            {
                text: "Hủy",
                onPress: () => {
                },
                style: "cancel"
            },
            {
                text: "Xóa",
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
                                utils.showBeautyAlert(navigation, "success", res?.data?.message ?? "Xóa thành công")
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
                        utils.showBeautyAlert(navigation, "success", "Tải file thành công. Vui lòng xem file trong mục tải về của điện thoại.")
                    })
                    .catch(error => console.log(error.message));
            })
            .catch(err => {
                utils.showBeautyAlert(navigation, "fail", "Có lỗi trong quá trình tải file.")
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
                    utils.showBeautyAlert(navigation, "success", res?.data?.message ?? "Cập nhật thành công")
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
                    console.log(res?.data)
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
                    Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại!!!")
                }

            })
            .catch(error => {
                Alert.alert("Có lỗi xảy ra", "Vui lòng thử lại!!!")
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
            title: 'Vui lòng chọn nguồn ảnh',
            negativeText: "Thoát",
            customContent: <View>
                <TouchableOpacity style={{ padding: AppSizes.padding }} onPress={handleOpenPhotoFromLibrary}>
                    <Text style={[AppStyles.baseText, { color: AppColors.balck, textAlign: 'center' }]}>Chọn ảnh từ thư viện</Text>
                </TouchableOpacity>
                <Divider style={{ marginHorizontal: '10%' }} />
                <TouchableOpacity style={{ padding: AppSizes.padding }} onPress={handleOpenCamera}>
                    <Text style={[AppStyles.baseText, { color: AppColors.balck, textAlign: 'center' }]}>Chụp ảnh</Text>
                </TouchableOpacity>
                <Divider />

            </View>
        }
        Dialog.show(dialogOption)
    }

    const removeFile = (item) => {
        const temp_attachments = attachments.filter(attachment => attachment.id != item.id)
        updateSchedule(temp_attachments)
        setAttachments(temp_attachments)
    }

    const renderAttachment = () => {
        if (attachments.length > 0) {
            return (
                <View style={styles.attachmentContainer}>
                    <View style={styles.attachmentContent}>
                        {
                            attachments.map((item, index) => {
                                return (
                                    <View key={index} style={styles.attachmentItem} onPress={() => downloadFile(item)}>
                                        <Text style={AppStyles.baseTextGray}>{item.name}</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            <ButtonIconComponent
                                                containerStyle={{ marginRight: AppSizes.padding }}
                                                source="AntDesign"
                                                name="close"
                                                size={25}
                                                color={AppColors.danger}
                                                action={() => removeFile(item)} />
                                            <ButtonIconComponent
                                                name="download"
                                                size={25}
                                                color={AppColors.primaryBackground}
                                                action={() => downloadFile(item)} />
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
                <Text style={AppStyles.baseTextGray}>Không có file đính kèm</Text>
            </View>
        }
    }

    const onchangeNumberCustomer = (value) => {
        setCustomerNumber(value)
    }

    const onchangeTvv = (value) => {
        setTvvNumber(value)
    }

    const onchangeAfyp = (value) => {
        setAfyp(value)
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return
        }
        //update schedule
        updateSchedule()

    }, [afyp, tvv_number, customer_number, attachments])

    return (
        <View style={[AppStyles.container]}>
            <NavigationBar
                isBack
                onLeftPress={() => navigation.goBack()}
                centerTitle="Kế hoạch chi tiết" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ margin: AppSizes.paddingXSmall, paddingBottom: AppSizes.padding}}>
                <View style={AppStyles.baseBox}>
                    <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingXSmall, fontSize: AppSizes.fontLarge }]} numberOfLines={2} ellipsizeMode="tail">
                        {workType}
                    </Text>
                    <Text style={[AppStyles.baseTextGray]}>
                        Nội dung: {!!content ? content : "Chưa có"}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name='schedule' size={20} color={AppColors.gray} />
                        <Text style={[AppStyles.baseTextGray, { marginLeft: AppSizes.paddingXSmall }]}>
                            {DateTimeUtil.format("HH:mm dddd DD/MM/YYYY", (scheduleData?.start_ts ?? 0) * 1000)}
                        </Text>

                    </View>
                    <Text style={[AppStyles.baseTextGray]} numberOfLines={2} ellipsizeMode="tail">
                        Người thực hiện: {!!for_user ? for_user : "Chưa có"}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={[AppStyles.baseTextGray, { marginRight: AppSizes.padding }]}>
                            Trạng thái:
                        </Text>

                        <DropdownComponent
                            textStyle={{ color: Helper.getStatusColor(scheduleData.status) }}
                            containerStyle={styles.dropdownBtnStyle}
                            data={actionStatus}
                            onSelect={(i) => onChangeValueStatus(i, scheduleData)}
                            defaultValue={getDefaultValue(scheduleData.status)}
                        />

                    </View>
                </View>
                {
                    isToChucSuKien && <View style={{ ...AppStyles.baseBox, marginTop: AppSizes.padding }}>
                        <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingXSmall, fontSize: AppSizes.fontLarge }]} numberOfLines={2} ellipsizeMode="tail">
                            Thông tin hội nghị
                        </Text>
                        <BaseInputViewComponent
                            keyboardType="numeric"
                            title="khách hàng/ ứng viên"
                            content={customer_number}
                            onChangeText={_.debounce(txt => onchangeNumberCustomer(txt), 2000)}
                        />
                        <BaseInputViewComponent
                            keyboardType="numeric"
                            title="Tvv"
                            content={tvv_number}
                            onChangeText={_.debounce(txt => onchangeTvv(txt), 2000)}
                        />
                        <BaseInputViewComponent
                            keyboardType="numeric"
                            title="AFYP"
                            content={afyp}
                            onChangeText={_.debounce(txt => onchangeAfyp(txt), 2000)}
                        />
                    </View>
                }

                <View style={{ ...AppStyles.baseBox, marginTop: AppSizes.padding }}>
                    <Text style={[AppStyles.boldTextGray, { marginVertical: AppSizes.paddingXSmall, fontSize: AppSizes.fontLarge }]} numberOfLines={2} ellipsizeMode="tail">
                        File Upload
                    </Text>
                    {
                        renderAttachment()
                    }
                    <ButtonComponent
                        action={() => { uploadFiles() }}
                        textStyle={{ color: AppColors.primaryBackground }}
                        title="Tải lên"
                        containerStyle={{ ...AppStyles.roundButton, borderColor: 'gray', width: 180, alignSelf: 'center', backgroundColor: AppColors.white, marginVertical: AppSizes.padding }}
                    />
                </View>
                <ButtonComponent
                    textStyle={{ color: AppColors.danger }}
                    containerStyle={{ ...AppStyles.roundButton, borderColor: 'gray', width: 180, alignSelf: 'center', backgroundColor: AppColors.white, marginVertical: AppSizes.paddingLarge }}
                    title="Xóa công việc"
                    action={() => deleteSchedule()} />
            </ScrollView>

            {
                isLoading && <LoadingComponent />
            }
        </View>
    );
}

const styles = StyleSheet.create({
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
    }
})


export default ScheduleDetailScreen;