import React from "react"
import { Text, View, StyleSheet } from "react-native"
import { AppStyles, AppColors, AppSizes } from "@theme"
import AwesomeListComponent from "react-native-awesome-list";
import { Divider } from 'react-native-paper';

const SimpleSessionListComponent = (props) => {
    const { title = "", data = [], containerStyle } = props
    const source = () => {
        return Promise.resolve(data)
    }

    const transformer = (res) => {
        return res
    }

    const renderSectionHeader = ({ section }) => <Text style={[AppStyles.boldTextGray, {backgroundColor: AppColors.white, paddingHorizontal: AppSizes.paddingSmall, paddingTop: AppSizes.padding }]}>{section?.title}</Text>
    const createSections = (res) => {
        console.log(res)
        return res
    }

    const renderItem = ({ item, index }) => {
        return (
            <View>
                <View key={item.id} style={{ padding: AppSizes.paddingSmall, marginBottom: AppSizes.paddingSmall }}>
                    <Text style={AppStyles.baseTextGray}>{item}</Text>
                </View>
                <Divider/>
            </View>)
    }

    return (
        <View style={[styles.containerStyle, containerStyle]}>
            <Text style={[AppStyles.boldTextGray, { paddingBottom: AppSizes.paddingSmall }]}>
                {title}:
            </Text>
            <AwesomeListComponent
                keyExtractor={(item, index) => item.id}
                source={source}
                emptyViewStyle={{ backgroundColor: 'transparent' }}
                transformer={transformer}
                renderItem={renderItem}
                isSectionList={true}
                renderEmptyView={() => <Text style={AppStyles.baseTextGray}>Không có dữ liệu</Text>}
                renderSectionHeader={renderSectionHeader}
                createSections={createSections} />

        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        ...AppStyles.boxShadow,
        margin: AppSizes.paddingSmall,
        padding: AppSizes.paddingSmall,
        flex:1
    },
})
export default SimpleSessionListComponent