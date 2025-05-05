#include "linear.hpp"// Probabbilmente va tolto 
#include <stdexcept> // 90 %sciuro che va tolto 

namespace lasd {



//LinearContainer
/* ************************************************************************** */

//operator
template <typename Data>
bool LinearContainer<Data>::operator==(LinearContainer<Data> &app)const noexcept{
    if (size != app.size){
        return false;
    }
    for(ulong i =0; i<size;i++){
        if((*this)[i] != app[i]){
            return false;
        }
    }
    return true;
}

template <typename Data>
bool LinearContainer<Data>::operator!=(LinearContainer<Data> &app)const noexcept{
    if (*this == app){
        return false;
    }
}

//Methods
template<typename Data>
inline const Data & LinearContainer<Data>::Front()const {
    if (size == 0){
        throw std::length_error("Empty");
    }
    return (*this)[0];
}


template <typename Data>
inline const Data & LinearContainer<Data>::Back()const{
    if (size == 0){
        throw std::length_error("Empty");
    }
    return (*this)[size-1];
}

//Override
template <typename Data>
inline void LinearContainer<Data>::Traverse(TraverseFun func)const {
    PreOrderTraverse(func);
}


template<typename Data>
inline void LinearContainer<Data>::PreOrderTraverse(TraverseFun func)const {
    for (ulong i = 0; i < size; i++){
        func((*this)[i]);
    }
    
}

template<typename Data>
inline void LinearContainer<Data>::PostOrderTraverse(TraverseFun func)const {
    for (ulong i = size; i > 0; i--){
        func((*this)[--i]);
    }
    
}

/* ************************************************************************** */


//MutableLinearContainer
/* ************************************************************************** */

template <typename Data>
inline Data & MutableLinearContainer<Data>::Front(){
    if (size == 0){
        throw std::length_error("Empty");
    }
    return (*this)[0];
}

template <typename Data>
inline Data & MutableLinearContainer<Data>::Back(){
    if (size == 0){
        throw std::length_error("Empty");
    }
    return (*this)[0];
}

template <typename Data>
inline void MutableLinearContainer<Data>::Map(MapFun func) {
    PreOrderMap(func);
}

template <typename Data>
inline void MutableLinearContainer<Data>::PreOrderMap(MapFun func){
    for (ulong i=0; i<size; i++){
        func((*this)[i]);
    }
}

template <typename Data>
inline void MutableLinearContainer<Data>::PostOrderMap(MapFun func){
    for (ulong i=size; i>0, i--){
        func((*this)[--i]);
    }
}

/* ************************************************************************** */

}