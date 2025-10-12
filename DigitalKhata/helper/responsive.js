import { Dimensions } from 'react-native';

// Get dimensions once when module loads
const { height, width } = Dimensions.get('window');

export const hp = (percentage) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
}

export const wp = (percentage) => {
  const value = (percentage * width) / 100;
  return Math.round(value);
}