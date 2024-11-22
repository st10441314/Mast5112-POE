import * as React from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    SafeAreaView,
    TextInput,
    Button,
    Alert,
    FlatList,
    ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Picker } from '@react-native-picker/picker';

interface CourseItem {
    dishName: string;
    price: string;
}

interface CourseSection {
    courseName: string;
    items: CourseItem[];
}

interface MenuItem {
    clientName: string;
    dishName: string;
    description: string;
    price: string;
    date: string;
    course: string;
}

interface HomeScreenProps {
    menuItems: MenuItem[];
    deleteMenuItem: (index: number) => void;
}

interface MenuItemsScreenProps {
    addMenuItem: (item: MenuItem) => void;
    searchMenuItems: (query: string) => MenuItem[];
}

interface ViewScreenProps {
    menuItems: MenuItem[];
    deleteMenuItem: (index: number) => void;
    searchMenuItems: (query: string) => MenuItem[];
}

interface MyTabsProps {
    menuItems: MenuItem[];
    addMenuItem: (item: MenuItem) => void;
    deleteMenuItem: (index: number) => void;
    searchMenuItems: (query: string) => MenuItem[];
}

const ImageDisplay: React.FC = () => (
    <View style={styles.imageContainer}>
        <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
        />
    </View>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ menuItems, deleteMenuItem }) => (
    <View style={styles.container}>
        <Text style={styles.title}>CHRISTOFFEL FOODS</Text>
        <ImageDisplay />

        <FlatList
            data={menuItems}
            renderItem={({ item, index }) => (
                <View style={styles.menuItem}>
                    <Text style={styles.menuText}>Client: {item.clientName}</Text>
                    <Text style={styles.menuText}>Dish: {item.dishName}</Text>
                    <Text style={styles.menuText}>Course: {item.course}</Text>
                    <Text style={styles.menuText}>Date: {item.date}</Text>
                    <Text style={styles.menuText}>Price: R{item.price}</Text>
                    <Button
                        title="DELETE"
                        color="red"
                        onPress={() => deleteMenuItem(index)}
                    />
                </View>
            )}
            keyExtractor={(item, index) => `${item.clientName}-${index}`}
            horizontal={true}
            style={styles.flatList}
            showsHorizontalScrollIndicator={false}
        />
    </View>
);

const MenuItemsScreen: React.FC<MenuItemsScreenProps> = ({ addMenuItem, searchMenuItems }) => {
    const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<MenuItem[]>([]);

    const handleSearch = () => {
        const filteredItems = searchMenuItems(searchQuery);
        setSearchResults(filteredItems);
    };

    const [formData, setFormData] = React.useState<MenuItem>({
        clientName: '',
        dishName: '',
        description: '',
        price: '',
        date: '',
        course: 'Hors d oeuvres',
    });

    const [courseSections, setCourseSections] = React.useState<CourseSection[]>([
        { courseName: 'Hors d oeuvres', items: [] },
        { courseName: 'Amuse-Bouche', items: [] },
        { courseName: 'Main Course', items: [] },
        { courseName: 'Salads', items: [] },
        { courseName: 'Fruit Course', items: [] },
        { courseName: 'Soups', items: [] },
        { courseName: 'Cheese Course', items: [] },
        { courseName: 'Palate Cleanser', items: [] },
        { courseName: 'Fish Course', items: [] },
        { courseName: 'Beverages', items: [] },
        { courseName: 'Fruit Course', items: [] },
        { courseName: 'Coffee & Tea', items: [] }
    ]);

    const [newCourseItem, setNewCourseItem] = React.useState({
        selectedCourse: '',
        dishName: '',
        price: ''
    });

    const updateField = (field: keyof MenuItem, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const courseOptions = [
        'Hors d oeuvres', 'Amuse-Bouche', 'Desserts', 'Salads', 'Main Course',
        'Soups', 'Palate Cleanser', 'Cheese Course', 'Fish course', 'Beverages',
        'Fruit Course', 'Coffee & Tea'
    ];

    const saveMenuItem = () => {
        const { clientName, dishName, price, date, course } = formData;
        if (clientName && dishName && price && date && course) {
            addMenuItem(formData);
            Alert.alert('Success', 'Menu item saved successfully');
            setFormData({
                clientName: '',
                dishName: '',
                description: '',
                price: '',
                date: '',
                course: 'Hors d oeuvres'
            });
        } else {
            Alert.alert('Error', 'Please fill out all required fields');
        }
    };

    const addItemToCourse = (courseName: string) => {
        if (!newCourseItem.dishName || !newCourseItem.price) {
            Alert.alert('Error', 'Please enter both dish name and price');
            return;
        }

        setCourseSections(prev => prev.map(section => {
            if (section.courseName === courseName) {
                return {
                    ...section,
                    items: [...section.items, {
                        dishName: newCourseItem.dishName,
                        price: newCourseItem.price
                    }]
                };
            }
            return section;
        }));

        setNewCourseItem({
            selectedCourse: '',
            dishName: '',
            price: ''
        });
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Add Menu Items</Text>
                <ImageDisplay />
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search menu items"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <Button
                        title="Search"
                        onPress={handleSearch}
                        color="grey"
                    />
                </View>
                {searchResults.length > 0 && (
                    <FlatList
                        data={searchResults}
                        keyExtractor={(item, index) => `search-${index}`}
                        renderItem={({ item }) => (
                            <View style={styles.searchResultItem}>
                                <Text>{item.dishName} - {item.course} - R{item.price}</Text>
                                <Button
                                    title="Add"
                                    onPress={() => {
                                        setFormData({
                                            ...formData,
                                            dishName: item.dishName,
                                            price: item.price,
                                            course: item.course
                                        });
                                    }}
                                    color="green"
                                />
                            </View>
                        )}
                    />
                )}
                <SafeAreaView>
                    {['clientName', 'dishName', 'description', 'date', 'price'].map((field) => (
                        <TextInput
                            key={field}
                            style={styles.input}
                            onChangeText={(value) => updateField(field as keyof MenuItem, value)}
                            value={formData[field as keyof MenuItem]}
                            placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                            textAlign='center'
                            keyboardType={field === 'price' ? 'numeric' : 'default'}
                        />
                    ))}
                    <Picker
                        selectedValue={formData.course}
                        style={styles.picker}
                        onValueChange={(value) => updateField('course', value)}
                    >
                        {courseOptions.map((course) => (
                            <Picker.Item key={course} label={course} value={course} />
                        ))}
                    </Picker>
                    <View style={styles.fixtoText}>
                        <Button 
                            title="SAVE" 
                            onPress={saveMenuItem}
                            color="green"   
                        />
                    </View>
                    <Text style={styles.title}>MENU</Text>
                    <View style={styles.selectedItemContainer}>
                        {courseSections.map((section) => (
                            <View key={section.courseName} style={styles.courseSection}>
                                <Text style={styles.courseSectionTitle}>
                                    {section.courseName}
                                </Text>
                                <View style={styles.courseInputContainer}>
                                    <TextInput
                                        style={styles.courseInput}
                                        placeholder="Dish name"
                                        placeholderTextColor="#666"
                                        value={newCourseItem.selectedCourse === section.courseName ? newCourseItem.dishName : ''}
                                        onChangeText={(text) => setNewCourseItem(prev => ({
                                            ...prev,
                                            selectedCourse: section.courseName,
                                            dishName: text
                                        }))}
                                    />
                                    <TextInput
                                        style={styles.courseInput}
                                        placeholder="Price"
                                        placeholderTextColor="#666"
                                        keyboardType="numeric"
                                        value={newCourseItem.selectedCourse === section.courseName ? newCourseItem.price : ''}
                                        onChangeText={(text) => setNewCourseItem(prev => ({
                                            ...prev,
                                            selectedCourse: section.courseName,
                                            price: text
                                        }))}
                                    />
                                    <Button
                                        title="Add"
                                        onPress={() => addItemToCourse(section.courseName)}
                                        color="green"
                                        style={styles.addButton}
                                    />
                                </View>
                                <FlatList
                                    data={section.items}
                                    keyExtractor={(item, idx) => `${section.courseName}-${idx}`}
                                    renderItem={({ item }) => (
                                        <View style={styles.courseItem}>
                                            <Text style={styles.courseItemText}>
                                                {item.dishName} - R{item.price}
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>
                        ))}
                    </View>
                </SafeAreaView>
            </View>
        </ScrollView>
    );
};

const ViewScreen: React.FC<ViewScreenProps> = ({ menuItems, deleteMenuItem, searchMenuItems }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<MenuItem[]>([]);

    const handleSearch = () => {
        const filteredItems = searchMenuItems(searchQuery);
        setSearchResults(filteredItems);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CHRISTOFFEL FOODS</Text>
            <ImageDisplay />
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search menu items"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <Button
                    title="Search"
                    onPress={handleSearch}
                    color="grey"
                />
            </View>
            {searchResults.length > 0 ? (
                <FlatList
                    data={searchResults}
                    renderItem={({ item, index }) => (
                        <View style={styles.menuItem}>
                            <Text style={styles.menuText}>Client: {item.clientName}</Text>
                            <Text style={styles.menuText}>Dish: {item.dishName}</Text>
                            <Text style={styles.menuText}>Course: {item.course}</Text>
                            <Text style={styles.menuText}>Date: {item.date}</Text>
                            <Text style={styles.menuText}>Price: R{item.price}</Text>
                            <Button
                                title="DELETE"
                                color="red"
                                onPress={() => deleteMenuItem(index)}
                            />
                        </View>
                    )}
                    keyExtractor={(item, index) => `${item.clientName}-${index}`}
                    horizontal={true}
                    style={styles.flatList}
                    showsHorizontalScrollIndicator={false}
                />
            ) : (
                <FlatList
                    data={menuItems}
                    renderItem={({ item, index }) => (
                        <View style={styles.menuItem}>
                            <Text style={styles.menuText}>Client: {item.clientName}</Text>
                            <Text style={styles.menuText}>Dish: {item.dishName}</Text>
                            <Text style={styles.menuText}>Course: {item.course}</Text>
                            <Text style={styles.menuText}>Date: {item.date}</Text>
                            <Text style={styles.menuText}>Price: R{item.price}</Text>
                            <Button
                                title="DELETE"
                                color="red"
                                onPress={() => deleteMenuItem(index)}
                            />
                        </View>
                    )}
                    keyExtractor={(item, index) => `${item.clientName}-${index}`}
                    horizontal={true}
                    style={styles.flatList}
                    showsHorizontalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const Tab = createBottomTabNavigator();

const MyTabs: React.FC<MyTabsProps> = ({ menuItems, addMenuItem, deleteMenuItem, searchMenuItems }) => (
    <Tab.Navigator
        screenOptions={{
            tabBarStyle: {
                backgroundColor: 'white',
                borderColor: 'black',
                bottom: 0,
                flexDirection:'row',
                justifyContent: 'space-between',
                alignItems: 'space',
            },
        }}
    >
        <Tab.Screen name="Home">
            {() => <HomeScreen menuItems={menuItems} deleteMenuItem={deleteMenuItem} />}
        </Tab.Screen>
        <Tab.Screen name="Enter Menu Items">
            {() => <MenuItemsScreen addMenuItem={addMenuItem} searchMenuItems={searchMenuItems} />}
        </Tab.Screen>
        <Tab.Screen name="View">
            {() => <ViewScreen menuItems={menuItems} deleteMenuItem={deleteMenuItem} searchMenuItems={searchMenuItems} />}
        </Tab.Screen>
    </Tab.Navigator>
);

const App: React.FC = () => {
    const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);

    const addMenuItem = (item: MenuItem) => {
        setMenuItems([...menuItems, item]);
        const updatedMenuItems = [...menuItems, item].sort((a, b) => {
            
            const courseComparison = a.course.localeCompare(b.course);
          

            if (courseComparison === 0) {
              return a.dishName.localeCompare(b.dishName);
}

return courseComparison;
});
setMenuItems(updatedMenuItems);
};

const deleteMenuItem = (index: number) => {
setMenuItems(menuItems.filter((_, i) => i !== index));
};

const searchMenuItems = (query: string) => {
return menuItems.filter(item =>
    item.dishName.toLowerCase().includes(query.toLowerCase())
);
};

return (
<NavigationContainer>
    <MyTabs 
        menuItems={menuItems} 
        addMenuItem={addMenuItem} 
        deleteMenuItem={deleteMenuItem}
        searchMenuItems={searchMenuItems}
    />
</NavigationContainer>
);
};

const styles = StyleSheet.create({

 container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        padding: 20,
    },
    imageContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
   
    input: {
        height: 50,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 30,
        fontSize: 16,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: 280,
        marginBottom: 20,
        backgroundColor: 'grey',
        color: 'white',
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    addButton: {
      width: 100,
    },
    fixtoText: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    courseSection: {
        width: '100%',
        marginBottom: 20,
    },
    courseSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
        textAlign: 'center',
    },
    menuItem: {
        backgroundColor: 'white',
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        width: 300,
        height: 'auto',
        alignItems: 'center',
    },
    menuText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
    },
    flatList: {
        marginTop: 20,
        marginBottom: 20,
    },

    scrollContainer: {
        backgroundColor: 'black',
    },
    selectedItemContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
        borderRadius: 15,
    },

searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    width: 280,
},
searchInput: {
    backgroundColor: '#f8f8ff',
    height: 50,
    width: 250,
    marginRight: 10
},
searchResultItem: {
    backgroundColor: 'grey',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 300
},
 courseInput: {
        height: 30,
        width: 100,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 5,
        color: 'black',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    courseItem: {
        backgroundColor: '#f8f8f8',
        padding: 8,
        borderRadius: 5,
        marginBottom: 5,
    },
    courseItemText: {
        color: 'black',
        fontSize: 14,
    },

});

export default App;