import * as React from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import { useSelector } from 'react-redux';


const Home = (props) => {
    const data = useSelector(state => state.mainReducer);
    React.useEffect(()=> {
        console.log(data);
    },[])
    return (
        <SafeAreaView>
            <View>
                <Text>
                    {data.test}
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default Home;