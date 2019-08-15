import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import styles from '../assets/styles';
import { SCREENS } from '../constants';
import { MAIN_BLUE } from '../assets/colorScheme';

export default props => {
	const [record, setRecord] = useState([]);

	props.navigation.addListener('willFocus', () => {
		AsyncStorage.getItem('record')
			.then(recordList => {
				// Get current list of recordings
				if (recordList) {
					setRecord(JSON.parse(recordList).reverse());
				}
			})
			.catch(err => console.log(err));
	});

	const newRecord = () => {
		props.navigation.navigate(SCREENS.DRAW);
	};

	const viewRecord = () => {
		props.navigation.navigate(SCREENS.EVENT);
	};

	return (
		<SafeAreaView style={styles.listBackground}>
			<View style={styles.header}>
				<Text style={[styles.text, styles.headerTitle]}>Ellipses</Text>
				<TouchableOpacity
					style={[styles.headerLink, styles.linkLeft]}
					onPress={newRecord}
				>
					<View style={styles.btnLeft}>
						<Icon
							name="plus"
							type="font-awesome"
							color={MAIN_BLUE}
							size={20}
						/>
					</View>
					<Text style={[styles.text, styles.headerBtn]}>Add</Text>
				</TouchableOpacity>
				{/* <TouchableOpacity style={[styles.headerLink, styles.linkRight]}>
					<View style={styles.btnRight}>
						<Text style={[styles.text, styles.headerMore]}>
							...
						</Text>
					</View>
				</TouchableOpacity> */}
			</View>
			<View style={styles.listWrap}>
				{record.map((item, index) => (
					<TouchableOpacity key={index} onPress={viewRecord}>
						<View
							style={
								index % 2 === 0
									? [styles.listItem, styles.evenItem]
									: [styles.listItem]
							}
						>
							<Text style={styles.text}>
								{moment(item.time).calendar()}
							</Text>
							<Icon
								name="chevron-right"
								type="font-awesome"
								color={MAIN_BLUE}
								size={20}
							/>
						</View>
					</TouchableOpacity>
				))}
				{/* <View style={styles.headerDrop}>
					<Text>Hi</Text>
				</View> */}
			</View>
		</SafeAreaView>
	);
};
