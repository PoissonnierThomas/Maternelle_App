import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        École le Petit Prince
      </Text>
      <Text style={styles.title}>
        1, rue des écoles
        13000 Saint Exupéry
      </Text>
      <Text style={styles.title}>
        Tél : 0412345678
      </Text>
      <Text style={styles.title}>
        Mail : contact@lepetitprince.fr
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
