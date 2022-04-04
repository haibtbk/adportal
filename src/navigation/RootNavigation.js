import { createNavigationContainerRef } from '@react-navigation/native';

const navigationRef = createNavigationContainerRef()

export default {
    navigationRef,
    navigate: (name, params) => {
        if (navigationRef.isReady()) {
            navigationRef.navigate(name, params);
        }
    }
} 
