/**
 * 推荐歌单
 */

import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Icon } from 'antd';
import { sampleSize } from 'lodash';
import { personalized } from '@/api';
import { getCount } from '@/utils';
import storage from '@/utils/storage';
import styles from './index.module.less';

function getSongList(data, handleClick) {
    const cached = storage.get('Personalized')
    if (cached) {
        data = cached
    } else {
        if (data.length > 10) {
            data = sampleSize(data, 10);
        }
        storage.set('Personalized', data)
    }
    return data.map(item => (
        <div key={item.id} className={styles.item} onClick={() => handleClick(item.id)}>
            <img className={styles.img} src={item.picUrl} alt={item.name} />
            <p>{item.name}</p>
            <div className={styles.playCount}>
                <Icon type="caret-right" />
                {getCount(item.playCount)}
            </div>
            <div className={styles.playIcon}>
                <Icon type="caret-right" theme="filled" />
            </div> 
        </div>
    ))
}

const Personalized = (props) => {
    const [list, setList] = useState(null);

    const { history } = props;

    useEffect(() => {
        personalized().then(res => {
            setList(res.result);
        });
    }, []);

    if (!list) {
        return (
            <div className={styles.personalized}>
                aaa
            </div>
        )
    }

    function handleClick(id) {
        history.push(`/playlist/${id}`);
    }

    return (
        <div className={styles.personalized}>
            <p className={styles.title}>
                推荐歌单
                <Icon type="right" />
            </p>
            <div className={styles.listWrapper}>
                {getSongList(list, handleClick)}
            </div>
        </div>
    );
};

export default withRouter(Personalized)
