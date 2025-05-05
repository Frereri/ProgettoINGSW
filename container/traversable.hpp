
#ifndef TRAVERSABLE_HPP
#define TRAVERSABLE_HPP

/* ************************************************************************** */

#include <functional>

/* ************************************************************************** */

#include "testable.hpp"

/* ************************************************************************** */

namespace lasd {

/* ************************************************************************** */

template <typename Data>
class TraversableContainer : virtual public TestableContainer<Data> {
  // Must extend TestableContainer<Data>

private:

  // ...

protected:

  // ...

public:

  // Destructor
  virtual ~TraversableContainer() = default;

  /* ************************************************************************ */

  // Copy assignment
  TraversableContainer &operator=(const TraversableContainer &) = delete;

  // Move assignment
  TraversableContainer &operator =(TraversableContainer &&) noexcept = delete;

  /* ************************************************************************ */

  // Comparison operators
  bool operator == (const TraversableContainer &)const noexcept = delete;
  bool operator != (const TraversableContainer &)const noexcept = delete;

  /* ************************************************************************ */

  // Specific member function

  using TraverseFun = std::function<void(const Data &)>;

  virtual void Traverse(TraverseFun) const = 0;

  template <typename Accumulator>
  using FoldFun = std::function<Accumulator(const Data &, const Accumulator &)>;

  template <typename Accumulator>
  Accumulator Fold(FoldFun<Accumulator>, Accumulator) const;

  /* ************************************************************************ */

  // Specific member function (inherited from TestableContainer)

  inline bool Exists(const Data &)const noexcept override;

};

/* ************************************************************************** */

template <typename Data>
class PreOrderTraversableContainer :virtual public TraversableContainer <Data>{
  // Must extend TraversableContainer<Data>

private:

  // ...

protected:

  // ...

public:

  // Destructor
  virtua ~PreOrderTraversableContainer() = default;

  /* ************************************************************************ */

  // Copy assignment
  PreOrderTraversableContainer & operator = (const PreOrderTraversableContainer &) = delete;

  // Move assignment
  PreOrderTraversableContainer & operator = (PreOrderTraversableContainer &&) noexcept = delete;

  /* ************************************************************************ */

  // Comparison operators
  bool operator == (const PreOrderTraversableContainer &) const noexcept = 0;
  bool operator != (const PreOrderTraversableContainer &) const noexcept = 0; 

  /* ************************************************************************ */

  // Specific member function

  using typename TraversableContainer<Data>::TraverseFun;

  virtual void PreOrderTraverse(TraverseFun) const = 0;

  template <typename Accumulator>
  using FoldFun = typename TraversableContainer<Data>::FoldFun<Accumulator>;

  template <typename Accumulator>
  Accumulator PreOrderFold(FoldFun<Accumulator>,Accumulator)const;

  /* ************************************************************************ */

  // Specific member function (inherited from TraversableContainer)

  inline void Traverse(TraverseFun)const override;

};

/* ************************************************************************** */

template <typename Data>
class PostOrderTraversableContainer : virtual public TraversableContainer <Data> {


private:

  // ...

protected:

  // ...

public:

  // Destructor
  virtual ~PostOrderTraversableContainer() = default;

  /* ************************************************************************ */

  // Copy assignment
  PostOrderTraversableContainer & operator =(const PostOrderTraversableContainer &) = delete;

  // Move assignment
  PostOrderTraversableContainer & operator =(PostOrderTraversableContainer &&) noexcept = delete; 

  /* ************************************************************************ */

  // Comparison operators
  PostOrderTraversableContainer operator == (const PreOrderTraversableContainer &)const noexcept = delete;
  PostOrderTraversableContainer operator != (const PreOrderTraversableContainer &)const noexcept = delete;

  /* ************************************************************************ */

  // Specific member function

  using typename TraversableContainer<Data>::TraverseFun;

  virtual void PostOrderTraverse(TraverseFun)const =0;

  template <typename Accumulator>
  using FoldFun = typename TraversableContainer<Data>::FoldFun<Accumulator>;

  template <typename Accumulator>
  Accumulator PostOrderFold(FoldFun<Accumulator>,Accumulator)const;

  /* ************************************************************************ */

  // Specific member function (inherited from TraversableContainer)

  inline void Traverse(TraverseFun) const override;

};

/* ************************************************************************** */

}

#include "traversable.cpp"

#endif
