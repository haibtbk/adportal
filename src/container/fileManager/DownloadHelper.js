import React from "react";
import { Platform } from "react-native"
import { API } from "@network"
import RNFS from 'react-native-fs'
import moment from 'moment';
import _ from 'lodash';

const downloadFile = (id) => {
    return new Promise((resolve, reject) => {
        const params = {
            library_record_id: id,
            submit: 1
        }
        API.downloadFile(params)
            .then(res => {
                const item = res?.data?.result
                if (item) {
                    const file_content = item?.file_content ?? ""
                    let fileName = item?.file_name ?? ""
                    if (Platform.OS === "android") {
                        fileName = `${fileName}_${moment().valueOf()}`
                    }
                    const ext = "." + item.file_type ?? ''
                    const path = Platform.OS == "android" ? RNFS.DownloadDirectoryPath : RNFS.DocumentDirectoryPath
                    const localFile = `${path}/${fileName}${ext}`;
                    RNFS.writeFile(localFile, file_content, 'base64')
                        .then(() => {
                            resolve(localFile)
                        })
                        .catch(error => {
                            console.log(error.message)
                            reject("Tải file không thành công, vui lòng thử lại.")
                        });

                } else {
                    reject("Tải file không thành công, vui lòng thử lại.")
                }

            })
            .catch(err => {
                reject("Tải file không thành công, vui lòng thử lại.")
            })
    })

}

export default downloadFile