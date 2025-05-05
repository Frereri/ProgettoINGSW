
#ifndef MAPPABLE_HPP
#define MAPPABLE_HPP

/* ************************************************************************** */

#include <functional>

/* ************************************************************************** */

#include "traversable.hpp"

/* ************************************************************************** */

namespace lasd {

/* ************************************************************************** */

template <typename Data>
class MappableContainer :virtual public TraversableContainer<Data> {
  

private:

  // ...

protected:

  // ...

public:

  // Destructor
  virtual ~MappableContainer() = default;

  /* ************************************************************************ */

  // Copy assignment
  MappableContainer & operator=(const MappableContainer &) = delete; 

  // Move assignment
  MappableContainer & operator=(MappableContainer &&) noexcept = delete;

  /* ************************************************************************ */

  // Comparison operators
  bool operator == (const MappableContainer &)const noexcept = delete; 
  bool operator != (const MappableContainer &)const noexcept = delete; 

  /* ************************************************************************ */

  // Specific member function

  using MapFun = std::function<void(Data &)>;

  virtual void Map(MapFun) = 0;

};

/* ************************************************************************** */

template <typename Data>
class PreOrderMappableContainer : virtual public MappableContainer<Data>, 
    virtual public PreOrderTraversableContainer <Data>{


private:

  // ...

protected:

  // ...

public:

  // Destructor
  virtual ~PreOrderMappableContainer() = default;

  /* ************************************************************************ */

  // Copy assignment
  PreOrderMappableContainer & operator=(const PreOrderMappableContainer&) = delete;

  // Move assignment
  PreOrderMappableContainer & operator=(PreOrderMappableContainer &&)noexcept = delete; 

  /* ************************************************************************ */

  // Comparison operators
  bool operator == (PreOrderMappableContainer)const noexcept = delete;
  bool operator != (PreOrderMappableContainer)const noexcept = delete; 

  /* ************************************************************************ */

  // Specific member function

  using typename MappableContainer<Data>::MapFun;

  virtual void PreOrderMap(MapFun) = 0;

  /* ************************************************************************ */

  // Specific member function (inherited from MappableContainer)

  inline void Map(MapFun) override; 

};

/* ************************************************************************** */

template <typename Data>
class PostOrderMappableContainer : virtual public MappableContainer, virtual public PostOrderTraversableContainer {
  

private:

  // ...

protected:

  // ...

public:

  // Destructor
  virtual ~PostOrderMappableContainer() = default;

  /* ************************************************************************ */

  // Copy assignment
  PostOrderMappableContainer & operator=(const PreOrderMappableContainer &) = delete; 

  // Move assignment
  PostOrderMappableContainer & operator=(PostOrderMappableContainer &&)noexcept = delete;

  /* ************************************************************************ */

  // Comparison operators
  bool operator == (const PostOrderMappableContainer)const noexcept = delete; 
  bool operator != (const PostOrderMappableContainer)const noexcept = delete;

  /* ************************************************************************ */

  // Specific member function

  using typename MappableContainer<Data>::MapFun;

  virtual void PostOrderMap(MapFun) = 0;

  /* ************************************************************************ */

  // Specific member function (inherited from MappableContainer)

  inline void Map(MapFun) override;

};

/* ************************************************************************** */

}

#include "mappable.cpp"

#endif
