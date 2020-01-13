import * as types from './mutationTypes'
import { playMode } from '@/assets/js/config'
import { shuffle } from '@/assets/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from '@/assets/js/cache'

const findIndex = (list, song) => {
    return list.findIndex((item) => {
        return item.id === song.id
    })
}

export const selectPlay = ({ commit, state }, { list, index }) => {
    commit(types.SET_SEQUENCELIST, list)
    if(state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = findIndex(randomList, list[index])
    }else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENTINDEX, index)
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = ({commit}, {list}) => {
    commit(types.SET_MODE, playMode.random)
    commit(types.SET_SEQUENCELIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    commit(types.SET_CURRENTINDEX, 0)
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = ({commit,state}, song) => {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    // 记录当前歌曲
    let currentSong = playlist[currentIndex]
    // 查找当前列表中是否有待插入的歌曲并返回其索引
    let fpIndex = findIndex(playlist, song)
    // 因为是插入歌曲，所以索引+1
    currentIndex++
    // 插入这首歌到当前索引位置
    playlist.splice(currentIndex, 0, song)
    // 如果已经包含了这首歌
    if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1)
            currentIndex--
        } else {
            playlist.splice(fpIndex + 1, 1)
        }
    }

    let currentSIndex = findIndex(sequenceList, currentSong) + 1

    let fsIndex = findIndex(sequenceList, song)

    sequenceList.splice(currentSIndex, 0, song)

    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1)
        }
    }
    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCELIST, sequenceList)
    commit(types.SET_CURRENTINDEX, currentIndex)
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = ({commit}, query) => {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = ({commit}, query) => {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = ({commit}) => {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = ({commit, state}, song) => {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)
    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCELIST, sequenceList)
    commit(types.SET_CURRENTINDEX, currentIndex)

    const playingState = playlist.length > 0
    commit(types.SET_PLAYING_STATE, playingState)

}

export const deleteSongList = ({commit} ) => {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCELIST, [])
    commit(types.SET_CURRENTINDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

// eslint-disable-next-line no-unused-vars
export const savePlayHistory = ({commit, state}, song) => {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = ({commit}, song) => {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = ({commit}, song) => {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
