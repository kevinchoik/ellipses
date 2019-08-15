import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Icon } from 'react-native-elements';
import styles from '../assets/styles';
import { SCREENS } from '../constants';
import { MAIN_BLUE } from '../assets/colorScheme';

export default props => {
	const seeList = () => {
		props.navigation.navigate(SCREENS.LIST);
	};

	return (
		<SafeAreaView style={styles.eventBackground}>
			<View style={styles.header}>
				<TouchableOpacity
					style={[styles.headerLink, styles.linkLeft]}
					onPress={seeList}
				>
					<View style={styles.btnLeft}>
						<Icon
							name="chevron-left"
							type="font-awesome"
							color={MAIN_BLUE}
							size={20}
						/>
					</View>
					<Text style={[styles.text, styles.headerBtn]}>
						View all
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.eventReplay}>
				<Text style={[styles.text, styles.replayText]}>Replay</Text>
				<Icon
					name="play"
					type="font-awesome"
					color={MAIN_BLUE}
					size={36}
				/>
			</View>
		</SafeAreaView>
	);
};
