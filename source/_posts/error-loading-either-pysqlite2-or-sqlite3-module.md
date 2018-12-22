---
title: django 报错 Error loading either pysqlite2 or sqlite3 modules
date: 2017-11-17 16:29:43
tags:
---
我的使用环境是`Python-3.5.3`。Django版本是1.10.5.

按照教程创建项目：

````shell
django-admin startproject blog_python
````

然后在启动的时候，结果报错了：

````shell
python3 manage.py runserver
````

结果报错信息如下：

````python
Unhandled exception in thread started by <function check_errors.<locals>.wrapper at 0x7fdc67089f28>
Traceback (most recent call last):
  File "/usr/local/python3/lib/python3.5/site-packages/django/db/backends/sqlite3/base.py", line 34, in <module>
    from pysqlite2 import dbapi2 as Database
ImportError: No module named 'pysqlite2'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/usr/local/python3/lib/python3.5/site-packages/django/db/backends/sqlite3/base.py", line 36, in <module>
    from sqlite3 import dbapi2 as Database
  File "/usr/local/python3/lib/python3.5/sqlite3/__init__.py", line 23, in <module>
    from sqlite3.dbapi2 import *
  File "/usr/local/python3/lib/python3.5/sqlite3/dbapi2.py", line 27, in <module>
    from _sqlite3 import *
ImportError: No module named '_sqlite3'

During handling of the above exception, another exception occurred:

Traceback (most recent call last):
  File "/usr/local/python3/lib/python3.5/site-packages/django/utils/autoreload.py", line 226, in wrapper
    fn(*args, **kwargs)
  File "/usr/local/python3/lib/python3.5/site-packages/django/core/management/commands/runserver.py", line 113, in inner_run
    autoreload.raise_last_exception()
  File "/usr/local/python3/lib/python3.5/site-packages/django/utils/autoreload.py", line 249, in raise_last_exception
    six.reraise(*_exception)
  File "/usr/local/python3/lib/python3.5/site-packages/django/utils/six.py", line 685, in reraise
    raise value.with_traceback(tb)
  File "/usr/local/python3/lib/python3.5/site-packages/django/utils/autoreload.py", line 226, in wrapper
    fn(*args, **kwargs)
  File "/usr/local/python3/lib/python3.5/site-packages/django/__init__.py", line 27, in setup
    apps.populate(settings.INSTALLED_APPS)
  File "/usr/local/python3/lib/python3.5/site-packages/django/apps/registry.py", line 108, in populate
    app_config.import_models(all_models)
  File "/usr/local/python3/lib/python3.5/site-packages/django/apps/config.py", line 199, in import_models
    self.models_module = import_module(models_module_name)
  File "/usr/local/python3/lib/python3.5/importlib/__init__.py", line 126, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
  File "<frozen importlib._bootstrap>", line 986, in _gcd_import
  File "<frozen importlib._bootstrap>", line 969, in _find_and_load
  File "<frozen importlib._bootstrap>", line 958, in _find_and_load_unlocked
  File "<frozen importlib._bootstrap>", line 673, in _load_unlocked
  File "<frozen importlib._bootstrap_external>", line 673, in exec_module
  File "<frozen importlib._bootstrap>", line 222, in _call_with_frames_removed
  File "/usr/local/python3/lib/python3.5/site-packages/django/contrib/auth/models.py", line 4, in <module>
    from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
  File "/usr/local/python3/lib/python3.5/site-packages/django/contrib/auth/base_user.py", line 52, in <module>
    class AbstractBaseUser(models.Model):
  File "/usr/local/python3/lib/python3.5/site-packages/django/db/models/base.py", line 119, in __new__
    new_class.add_to_class('_meta', Options(meta, app_label))
  File "/usr/local/python3/lib/python3.5/site-packages/django/db/models/base.py", line 316, in add_to_class
    value.contribute_to_class(cls, name)
  File "/usr/local/python3/lib/python3.5/site-packages/django/db/models/options.py", line 214, in contribute_to_class
    self.db_table = truncate_name(self.db_table, connection.ops.max_name_length())
  File "/usr/local/python3/lib/python3.5/site-packages/django/db/__init__.py", line 33, in __getattr__
    return getattr(connections[DEFAULT_DB_ALIAS], item)
  File "/usr/local/python3/lib/python3.5/site-packages/django/db/utils.py", line 211, in __getitem__
    backend = load_backend(db['ENGINE'])
  File "/usr/local/python3/lib/python3.5/site-packages/django/db/utils.py", line 115, in load_backend
    return import_module('%s.base' % backend_name)
  File "/usr/local/python3/lib/python3.5/importlib/__init__.py", line 126, in import_module
    return _bootstrap._gcd_import(name[level:], package, level)
  File "/usr/local/python3/lib/python3.5/site-packages/django/db/backends/sqlite3/base.py", line 39, in <module>
    raise ImproperlyConfigured("Error loading either pysqlite2 or sqlite3 modules (tried in that order): %s" % exc)
django.core.exceptions.ImproperlyConfigured: Error loading either pysqlite2 or sqlite3 modules (tried in that order): No module named '_sqlite3'
````

最后在这里查到了解决办法：

http://stackoverflow.com/questions/1210664/no-module-named-sqlite3

首先我们先执行一下命令：

````shell
yum install sqlite-devel
````

然后使用以下命令进行Python重装：

`./configure`如下：

````shell
./configure --prefix=/usr/local/python3/ --enable-loadable-sqlite-extensions
make && make install
````

这样重新执行前面的程序，就正常了：

````shell
[root@localhost blog_python]# python3 manage.py runserver
Performing system checks...

System check identified no issues (0 silenced).

Not checking migrations as it is not possible to access/create the django_migrations table.
February 12, 2017 - 14:42:20
Django version 1.10.5, using settings 'blog_python.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
````
