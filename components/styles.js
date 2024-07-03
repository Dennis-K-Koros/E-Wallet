import styled from 'styled-components';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Pressable } from 'react-native';

const StatusBarHeight = Constants.statusBarHeight;

//Colors 
export const Colors = {
  primary: "#ffffff",
  secondary: "#F0F4F8",
  tertiary: "#1E293B",
  darklight: "#9CA3AF",
  brand: "#F59E0B",
  green: "#10B981",
  red: "#EF4444",
  gray: "#6B7280",
  lightGreen: 'rgba(16,185,129,0.1)',
  // Category Colors
  Food: '#FFC0CB',
  Drinks: '#A52A2A',
  Shopping: '#800080',
  Misc: '#808080',
  Transport: '#ADD8E6',
  Entertainment: '#FFA500',
  Housing: '#90EE90',
  Electronics: '#0000FF',
  Medical: '#FF0000',
  Education: '#10B981',
  Salary: '#A52A2A',
  Investments: '#FFD700',
  Allowance: '#10B981',
  Bonus: '#FFA500',
  Other: '#0000FF',
};
const { primary, secondary, tertiary, darklight, brand, green, red} = Colors;

export const StyledContainer = styled(View)`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 30}px;
  background-color: ${Colors.primary};
`;


export const InnerContainer = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const WelcomeContainer = styled(InnerContainer)`
  padding: 25px;
  padding-top: 10px;
  justify-content: center;
`;

export const PageLogo = styled(Image)`
  width: 250px;
  height: 200px;
`;

export const Avatar = styled(Image)`
  width: 100px;
  height: 100px;
  margin: auto;
  border-radius: 50px;
  border-width: 2px;
  border-color: ${Colors.secondary};
  margin-bottom: 10px;
  margin-top: 10px;
`;

export const WelcomeImage = styled(Image)`
  height: 50%;
  min-width: 100%;
`;

export const PageTitle = styled(Text)`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${Colors.brand};
  padding: 10px;

  ${(props) => props.welcome && `
    font-size: 35px;
  `}
`;

export const SubTitle = styled(Text)`
  font-size: 18px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold; 

  color: ${Colors.tertiary};

  ${(props) => props.welcome && `
    margin-bottom: 5px;
    font-weight: normal;
  `}
`;


export const StyledFormArea = styled(View)`
  width: 90%;
`;

export const StyledTextInput = styled(TextInput)`
  background-color: ${Colors.secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-vertical: 3px;
  margin-bottom: 10px;
  color: ${Colors.tertiary};
`;

export const StyledInputLabel = styled(Text)`
  color: ${Colors.tertiary};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcon = styled(View)`
  left : 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled(TouchableOpacity)`
  right : 15px;
  top: 38px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: ${Colors.brand};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
  flex-direction: row;

  ${(props) => props.google && `
    background-color: ${Colors.green};
  `}
`;

export const ButtonText = styled(Text)`
  color: ${Colors.primary};
  font-size: 16px;
  padding-left: 10px;

  ${(props) => props.google && `
    padding-left: 10px;
    padding-right: 10px;
  `}
`;


export const MsgBox = styled(Text)`
  text-align: center;
  font-size: 13px;
  color: ${(props) => (props.type == 'SUCCESS' ? green : red)};
`;

export const Line = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${Colors.darklight};
  margin-vertical: 10px;
`

export const ExtraView = styled(View)`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

export const ExtraText = styled(Text)`
  justify-content: center;
  align-content: center;
  color: ${Colors.tertiary};
  font-size: 15px;
`;

export const TextLink = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
`;

export const TextLinkContent = styled(Text)`
  color: ${Colors.brand};
  font-size: 15px;

  ${(props) => {
    const { resendStatus } = props;
    if (resendStatus === 'Failed!') {
      return `color: ${Colors.red};`;
    } else if (resendStatus === 'Sent!') {
      return `color: ${Colors.green};`;
    }
  }}
`;


//verification components

export const TopHalf = styled(View)`
  flex : 1;
  justify-content: center;
  padding: 20px;
`;

export const IconBg = styled(View)`
  width: 250px;
  height: 250px;
  background-color: ${Colors.lightGreen};
  border-radius: 250px;
  justify-content: center;
  align-items: center;
`;

export const BottomHalf = styled(TopHalf)`
  justify-content: space-around;
`;

export const InfoText = styled(Text)`
  color : ${Colors.gray};
  font-size : 15px;
  text-align: center;
`;

export const EmphasizeText = styled(Text)`
  font-weight: bold;
  font-style: italic;
`;

export const InlineGroup = styled(View)`
  flex-direction: row;
  padding: 10px;
  justify-content: center;
  align-items: center;
`;

// modal styles
export const ModalContainer = styled(StyledContainer)`
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.7);
`;

export const ModalView = styled(View)`
  margin: 20px;
  background-color: white;
  border-radius: 20px;
  padding: 35px;
  align-items: center;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  width:100%;
`;

//pin input styles
export const CodeInputSection = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  margin-vertical: 30px;
`;

export const HiddenTextInput = styled(TextInput)`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
`;

export const CodeInputContainer = styled(Pressable)`
  width: 70%;
  flex-direction: row;
  justify-content: space-between;
`;

export const CodeInput = styled(View)`
  border-color: ${Colors.lightGreen};
  min-width: 15%;
  border-width: 2px;
  border-radius: 5px;
  padding: 12px;
`;

export const CodeInputText = styled(Text)`
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: ${Colors.brand};
`;

export const CodeInputFocused = styled(CodeInput)`
  border-color: ${Colors.green};
`;

export const DashboardTitle = styled(PageTitle)`
  font-size: 24px;
  text-align: right;
  padding: 10px;
`;

export const DashboardSubtitle = styled(SubTitle)`
  font-size: 16px;
  margin-bottom: 10px;
`;

// Dashboard styles using styled-components
export const DashboardContainer = styled(StyledContainer)`
  padding: 0;
`;

export const DashboardScrollView = styled(ScrollView)`
  background-color: ${Colors.primary};
  padding: 0;
`;

export const DashboardInnerView = styled(View)`
  padding: 25px;
`;

export const BalanceBox = styled(View)
  `background-color: ${Colors.secondary};
  border-radius: 10px;
  padding: 5px;
  align-items: center;
  margin-bottom: 10px;`
;

export const Row = styled(View)
  `flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;`
;

export const ExpenseIncomeBox = styled(View)
 ` background-color: ${Colors.secondary};
  border-radius: 10px;
  padding: 10px;
  width: 48%;
  align-items: center;`
;

export const GrayText = styled(Text)
  `color: ${Colors.gray};
`;

export const NavBar = styled(View)
  `flex-direction: row;
  justify-content: space-around;
  background-color: ${Colors.secondary};
  padding: 10px;`
;

export const NavItem = styled(TouchableOpacity)
  `align-items: center;`
;

export const NavItemCenter = styled(TouchableOpacity)
  `background-color: ${Colors.brand};
  width: 55px;
  height: 55px;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  margin-top: -30px;`
;

export const NavText = styled(Text)
  `color: ${Colors.brand};
  font-size: 12px;`
;

export const NavTextCenter = styled(Text)
  `color: ${Colors.primary};
  font-size: 12px;`
;

export const TransactionsBox = styled(View)`
  background-color: ${Colors.secondary};
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
`;

export const TransactionCard = styled(View)`
  padding: 10px;
  background-color: ${Colors.primary};
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const TransactionText = styled(Text)`
  color: ${Colors.tertiary};
  font-size: 16px;
`;

export const TransactionSeparator = styled(View)`
  height: 1px;
  width: 100%;
  background-color: ${Colors.darklight};
  margin-vertical: 5px;
`;

export const PickerContainer = styled(View)`
  border: 1px solid ${Colors.gray};
  border-radius: 5px;
  padding: 5px;
  width: 150px;
`;

export const PickerText = styled(Text)`
  color: ${Colors.gray};
  font-size: 16px;
`;

// Profile styles
export const ProfileContainer = styled(StyledContainer)`
  padding: 0;
`;

export const ProfileInnerView = styled(View)`
  padding: 25px;
`;

export const ProfileTitle = styled(PageTitle)`
  font-size: 30px;
  text-align: left;
`;

export const ProfileSubtitle = styled(SubTitle)`
  font-size: 20px;
  text-align: left;
`;

export const ProfileBox = styled(View)`
  background-color: ${Colors.secondary};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
`;

export const ProfileText = styled(Text)`
  font-size: 16px;
  color: ${Colors.tertiary};
`;

export const ProfileButton = styled(TouchableOpacity)`
  padding: 15px;
  background-color: ${Colors.brand};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
`;

export const ProfileButtonText = styled(Text)`
  color: ${Colors.primary};
  font-size: 16px;
  font-weight: bold;
`;
