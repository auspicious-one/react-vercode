import React, {
    FunctionComponent,
    useState,
    useEffect,
    useImperativeHandle,
} from 'react';
import styles from './assets/index.less';

interface IProps {
    /** 要覆盖的样式 */
    style?: any;

    /** 验证码长度，默认为6 */
    num?: number;
    
    /** 实时传递变化给父组件的函数 */
    getCode?: Function;
    
    /** 父组件的 useRef */
    cRef?: any;
}

/**
 * 格子验证码输入框
 * @param props
 * @constructor
 */
const VerCodeInput: FunctionComponent<any> = (props: IProps) => {

    const { style, num = 6, getCode, cRef } = props;

    /** 验证码 */
    const [code, setCode] = useState('');

    /** 当前输入框的Dom对象 */
    const [textInput, setTextInput] = useState();

    /** 输入框是否获得焦点 */
    const [isFocus, setIsFocus] = useState(false);

    /** 组件是否销毁 */
    let isUnmounted = false;

    /**
     * 暴露给父组件的方法
     */
    useImperativeHandle(cRef, () => ({
        /**
         * 让输入框获得聚焦
         */
        setFocus: () => {
            !isUnmounted && textInput.focus();
        },
        /**
         * 清除当前输入框的内容
         */
        clear: () => {
            !isUnmounted && setCode('');
        },
    }));

    useEffect(() => {
        return () => {
            isUnmounted = true;
        };
    }, []);

    /**
     * 输入框格子
     * @param props 
     */
    const Item = (props: { index: number; }) => {
        const { index } = props;
        return (
            <div className={styles.input_item} key={index}>
                {code.length === index && isFocus ? <span /> : code[index]}
            </div>
        );
    };

    return (
        <div style={style} className={styles.input_main}>
            {Array(num).fill('').map((item, index) => (
                <Item key={index} index={index} />
            ))}
            <input
                type={'number'}
                maxLength={num}
                value={code}
                onFocus={() => !isUnmounted && setIsFocus(true)}
                onBlur={() => !isUnmounted && setIsFocus(false)}
                ref={input => {
                    setTextInput(input);
                }}
                onChange={e => {
                    const value = e.target.value;
                    if (!isUnmounted && value.length <= num) {
                        setCode(value);
                        if (toString.call(getCode) === '[object Function]') getCode(value); // 传递给父组件
                    }
                }}
            />
        </div>
    );
};

export default VerCodeInput;
