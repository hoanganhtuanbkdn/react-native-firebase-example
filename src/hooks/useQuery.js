import React, { useEffect, useState } from 'react';
import { getDataByCollection } from '../firebaseConfig';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

export default function useQuery(name, filter = {}) {
  const { _skip = false } = filter;
  const cacheKey = JSON.stringify(filter);
  const [_data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const getData = async () => {
    setLoading(true);
    const { data } = await getDataByCollection(name, filter);
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!_skip && isFocused) {
      getData();
    }
  }, [cacheKey, _skip, isFocused]);

  return { data: _data, loading, refetch: getData };
}
