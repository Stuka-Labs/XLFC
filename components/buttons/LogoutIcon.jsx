import Svg, { Path } from 'react-native-svg';

const LogoutIcon = ({ color = '#1D82C6' }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 -960 960 960">
    <Path
      d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"
      fill={color} // Use dynamic color from props
    />
  </Svg>
);

export default LogoutIcon;
