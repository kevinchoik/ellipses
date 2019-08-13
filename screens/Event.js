import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from '../assets/styles';

export default () => {
	return (
		<View style={styles.drawBackground}>
			<Text style={styles.test}>ABCDEFG</Text>
		</View>
	);
};
