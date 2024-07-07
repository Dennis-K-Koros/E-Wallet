import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class NotificationHandler {
    static configure = () => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    };

    static scheduleDailyTransactionReminder = () => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: "Reminder",
                body: "Don't forget to log your transactions for the day!",
            },
            trigger: {
                hour: 21,
                minute: 0,
                repeats: true,
            },
        });
    };

    static async scheduleBudgetNotification(budget) {
        const spentPercentage = (budget.spentAmount / budget.amount) * 100;
        const roundedPercentage = Math.round(spentPercentage); // Round to whole number

        if (roundedPercentage >= 80 && roundedPercentage < 100) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Budget Alert",
                    body: `You have spent ${roundedPercentage}% of your budget for ${budget.category}.`,
                },
                trigger: null,
            });
        } else if (roundedPercentage >= 100) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Budget Alert",
                    body: `You have exceeded your budget for ${budget.category}!`,
                },
                trigger: null,
            });
        }
    }

    static checkBudgetsAndNotify = async () => {
        const budgets = JSON.parse(await AsyncStorage.getItem('budgets')) || [];
        budgets.forEach(budget => {
            NotificationHandler.scheduleBudgetNotification(budget);
        });
    };
}

export default NotificationHandler;
