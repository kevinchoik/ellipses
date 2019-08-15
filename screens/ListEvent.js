import React, { useState } from 'react';
import { View, Text, TouchableOpacity, AsyncStorage } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import styles from '../assets/styles';
import { SCREENS } from '../constants';
import { MAIN_BLUE } from '../assets/colorScheme';

export default props => {
	const [record, setRecord] = useState([]);

	const update = () => {
		// AsyncStorage.setItem('record', '');
		AsyncStorage.getItem('record')
			.then(recordList => {
				// Get current list of recordings
				if (recordList) {
					// Parse the record
					recordList = JSON.parse(recordList);
					const eventRemove = props.navigation.getParam('remove');
					const eventTitle = props.navigation.getParam('title');
					if (eventRemove) {
						// Remove an event
						const remIndex =
							recordList.length -
							1 -
							props.navigation.getParam('index');
						recordList.splice(remIndex, 1);
					} else if (typeof eventTitle == 'string') {
						// Edit the title
						const editIndex =
							recordList.length -
							1 -
							props.navigation.getParam('index');
						const editEvent = recordList[editIndex];
						editEvent.title = eventTitle;
						recordList[editIndex] = editEvent;
					}
					// Reverse the array so that most recent appears on top
					setRecord([...recordList].reverse());
					// Save changes to persistent storage
					if (eventRemove || typeof eventTitle == 'string') {
						return AsyncStorage.setItem(
							'record',
							JSON.stringify(recordList)
						);
					}
				}
			})
			.catch(err => console.log(err));
	};

	const subscription = props.navigation.addListener('willFocus', update);
	props.navigation.addListener('willBlur', () => subscription.remove());

	const newRecord = () => {
		props.navigation.navigate(SCREENS.DRAW);
	};

	const viewRecord = (item, index) => {
		props.navigation.navigate(SCREENS.EVENT, { ...item, index });
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
			</View>
			<View style={styles.listWrap}>
				{record.map((item, index) => (
					<TouchableOpacity
						key={index}
						onPress={() => viewRecord(item, index)}
					>
						<View
							style={
								index % 2 === 0
									? [styles.listItem, styles.evenItem]
									: [styles.listItem]
							}
						>
							<Text style={styles.text}>
								{item.title
									? item.title
									: moment(item.time).calendar()}
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
			</View>
		</SafeAreaView>
	);
};
