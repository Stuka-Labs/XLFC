import { View, Text, Keyboard, BackHandler, NativeEventSubscription } from 'react-native'
import { useState, useEffect, useMemo, useCallback, forwardRef, useRef } from 'react'
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetModalProps } from '@gorhom/bottom-sheet'
import { useSharedValue } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import useStateRef from '../../hooks/useStateRef'

const CustomBottomSheet = forwardRef((props, ref) => {

  // const [isKeyboardVisible, setKeyboardVisible] = useStateRef(false)
  // const { handleSheetPositionChange } =
  //   useBottomSheetBackHandler(ref)

  const [paddingBottom, setPaddingBottom] = useState(0)

  // const snapPoints = useMemo(() => [300], [])
  const animatedContentHeight = useSharedValue(0)
  const insets = useSafeAreaInsets()

  const renderBackdrop = useCallback((props) => 
    <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} onPress={Keyboard.dismiss} {...props} />
  )

  // const handleSheetChanges = useCallback((index) => {
  //   console.log('Changed', index)
  //   // if (index == -1)
  //   //   Keyboard.dismiss()
  // }, [])

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        // setKeyboardVisible(true); // or some other action
        // console.log('Will Show', isKeyboardVisible.current)
        setPaddingBottom(0)
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        // console.log('Will Hide', isKeyboardVisible.current)
        // setKeyboardVisible(false); // or some other action
        setPaddingBottom(insets.bottom)
      }
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])
  
  return (
    <BottomSheet
      ref={ref}
      index={props.index ?? -1}
      // onChange={handleSheetPositionChange}
      // onChange={handleSheetChanges}
      onChange={props.changes}
      // snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={props.hideBackDrop ? null : renderBackdrop}
      enableDynamicSizing={true}
      contentHeight={animatedContentHeight}
      handleStyle={{ display: props.noTopPadding ? 'none' : 'block' }}
    >
      {/* <BottomSheetView style={styles.contentContainer}>
        <Text>Awesome 🎉</Text>
      </BottomSheetView> */}
      {/* <View>
        <Text onPress={handleClosePress}>Close</Text>
        <BottomSheetTextInput style={{ width: '100%', backgroundColor: '#' }} placeholder="Hey"/>
      </View> */}
      {/* <BottomSheetTextInput style={{
        marginTop: 8,
        marginBottom: 10,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: 20,
        padding: 8,
        backgroundColor: 'rgba(151, 151, 151, 0.25)',
      }} /> */}
      {/* <View style={{
        flex: 1,
        alignItems: 'center',
        height: '300',
        backgroundColor: '#000'
      }}>
        <Text>{ props.title }</Text>
      </View> */}
      <BottomSheetView style={{
        flex: 1,
        alignItems: 'center',
        // ...props.style
        // paddingBottom: isKeyboardVisible.current ? 0 : insets.bottom
        paddingBottom: Math.max(insets.bottom, 16)
        // paddingBottom: paddingBottom
      }}>
        {/* <View className={`pb-[${paddingBottom}px] w-full`}> */}
        {/* <View className={`pb-4 pt-${props.noTopPadding ? '0' : '2'} w-full`}> */}
        <View className={`pt-${props.noTopPadding ? '0' : '2'} w-full`}>
          { props.children }
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
})

const useBottomSheetBackHandler = (bottomSheetRef) => {
  const backHandlerSubscriptionRef = useRef(null);
  
  const handleSheetPositionChange = useCallback(
    (index) => {
      const isBottomSheetVisible = index >= 0;
      if (isBottomSheetVisible && !backHandlerSubscriptionRef.current) {
        // setup the back handler if the bottom sheet is right in front of the user
        backHandlerSubscriptionRef.current = BackHandler.addEventListener(
          'hardwareBackPress',
          () => {
            bottomSheetRef.current?.close();
            return true
          }
        )
      } else if (!isBottomSheetVisible) {
        backHandlerSubscriptionRef.current?.remove();
        backHandlerSubscriptionRef.current = null;
      }
    },
    [bottomSheetRef, backHandlerSubscriptionRef],
  );

  return { handleSheetPositionChange };
}

export default CustomBottomSheet